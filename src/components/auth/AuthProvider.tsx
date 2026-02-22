import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { getCurrentSession, logout as authLogout, type AuthUser } from "@/integrations/auth";

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    roles: string[];
    isAdmin: boolean;
    isSuperAdmin: boolean;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
    connectionError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<string[]>([]);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    // Use refs to avoid stale closures in background callbacks
    const userRef = React.useRef<AuthUser | null>(null);
    const isLoadingRef = React.useRef(true);
    const retryCountRef = React.useRef(0);

    const updateAuth = (newUser: AuthUser | null, newRoles: string[]) => {
        userRef.current = newUser;
        if (newUser) {
            localStorage.setItem("bulbul_admin_session_hint", "true");
        } else {
            localStorage.removeItem("bulbul_admin_session_hint");
        }
        setUser(newUser);
        setRoles(newRoles);
    };

    const fetchSession = async () => {
        try {
            setConnectionError(null);

            // Set a safety timeout of 30 seconds for session fetching (slightly longer than auth.ts)
            const timeoutId = setTimeout(() => {
                if (isLoadingRef.current) {
                    console.warn("AuthContext: fetchSession safety timeout reached");
                    const hasHint = localStorage.getItem("bulbul_admin_session_hint") === "true";
                    if (hasHint && !userRef.current) {
                        setConnectionError("আপনার ইন্টারনেট সংযোগ ধীর। পুনরায় চেষ্টা করা হচ্ছে...");
                        // Don't set isLoading to false if we expect a user, keep trying
                        fetchSession();
                    } else {
                        setIsLoading(false);
                        isLoadingRef.current = false;
                    }
                }
            }, 30000);

            const result = await getCurrentSession();
            const { user: sessionUser, isTimeout } = result;

            clearTimeout(timeoutId);

            if (sessionUser) {
                console.log("AuthContext: Session user found:", sessionUser.email);
                updateAuth(sessionUser, sessionUser.roles || []);
                setConnectionError(null);
                retryCountRef.current = 0;
            } else {
                // Determine if we should clear the session or keep the existing one
                const hasError = !!result.error && result.error !== "No active session";
                const currentUser = userRef.current;
                const hasHint = localStorage.getItem("bulbul_admin_session_hint") === "true";

                if (currentUser && (isTimeout || hasError)) {
                    // We have a user, and either it timed out or hit some other network/DB error
                    // DO NOT log out - just warn and maintain status quo
                    console.warn(`AuthContext: Background check ${isTimeout ? 'timed out' : 'failed with error'}. Preserving session.`, result.error);
                    setConnectionError("ইন্টারনেট সংযোগে সমস্যা হচ্ছে। আপনার ডাটা সুরক্ষিত আছে।");
                } else if (!currentUser && hasHint && (isTimeout || hasError)) {
                    // Initial load/Refresh but timed out/errored - PRESERVE LOADING if hint exists
                    console.warn("AuthContext: Initial fetch failed but hint exists. Retrying...");
                    setConnectionError("ইন্টারনেট দুর্বল। সেশন চেক করা হচ্ছে...");

                    if (retryCountRef.current < 3) {
                        retryCountRef.current++;
                        setTimeout(fetchSession, 2000); // Retry after 2s
                        return; // Don't proceed to finally (yet)
                    } else {
                        // Too many retries, still fallback to loading=false eventually 
                        // but let the user decide to refresh manually
                        setConnectionError("সার্ভারের সাথে সংযোগ করা সম্ভব হচ্ছে না। দয়া করে পেজটি রিফ্রেশ করুন।");
                    }
                } else {
                    // "No active session" or initial load failed without a previous user/hint to fallback to
                    console.log("AuthContext: Clearing session state. Reason:", result.error || "No active session");
                    updateAuth(null, []);
                    setConnectionError(null);
                }
            }
        } catch (error) {
            console.error("AuthContext: Error in fetchSession:", error);
            // Only clear user if we don't have one yet to avoid sudden logouts on glitches
            if (!userRef.current && localStorage.getItem("bulbul_admin_session_hint") !== "true") {
                updateAuth(null, []);
            }
        } finally {
            // Only end loading if we don't have a pending retry and don't have a persistent error
            if (retryCountRef.current === 0 || retryCountRef.current >= 3) {
                setIsLoading(false);
                isLoadingRef.current = false;
            }
        }
    };

    useEffect(() => {
        // Initial session fetch
        fetchSession();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("AuthContext: Auth state changed event:", event);

            if (session) {
                console.log("AuthContext: Valid session for event:", event, ". Updating user...");
                await fetchSession();
            } else {
                // EXTREME CAUTION: Only clear state on explicit SIGNED_OUT or if no user exists
                // This prevents network glitches from logging out a user who is filling a form.
                if (event === 'SIGNED_OUT') {
                    console.log("AuthContext: Explicit SIGNED_OUT event. Clearing state.");
                    updateAuth(null, []);
                    setIsLoading(false);
                    isLoadingRef.current = false;
                } else if (userRef.current) {
                    console.warn(`AuthContext: Received null session for event ${event} while user is active. PRESERVING session.`);
                    // Still attempt to refresh/fetch but it will preserve if it fails
                    await fetchSession();
                } else {
                    // No session and no user (initial load or truly logged out)
                    console.log("AuthContext: No session and no active user for event:", event);
                    setIsLoading(false);
                    isLoadingRef.current = false;
                }
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await authLogout();
        updateAuth(null, []);
    };

    const value = {
        user,
        isLoading,
        roles,
        isAdmin: roles.includes("admin") || roles.includes("super_admin"),
        isSuperAdmin: roles.includes("super_admin"),
        logout,
        refreshSession: fetchSession,
        connectionError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
