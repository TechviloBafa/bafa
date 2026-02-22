import { supabase } from "./client";

// Check if user has admin or super_admin role
export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    console.log("auth.ts: Checking admin role for user:", userId);
    if (!userId) {
      console.warn("auth.ts: No userId provided to checkAdminRole");
      return false;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (error) {
      console.error("auth.ts: Error in checkAdminRole query:", error);
      return false;
    }

    const roles = (data || []).map((row: { role: string }) => row.role);
    const hasAdmin = roles.includes("admin") || roles.includes("super_admin");
    console.log("auth.ts: User roles:", roles, "Has admin access:", hasAdmin);
    return hasAdmin;
  } catch (err) {
    console.error("auth.ts: Unexpected error in checkAdminRole:", err);
    return false;
  }
}

// Types
export type UserRole = "admin" | "super_admin" | "user" | "student" | "teacher";

export type AuthUser = {
  id: string;
  email: string;
  roles: UserRole[];
};

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
  isLoading?: boolean;
  isTimeout?: boolean;
}

// Get all roles for a user
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error) {
    console.error("auth.ts: Error fetching user roles:", error);
    throw error; // Throw so caller knows it failed
  }

  return (data || []).map((row: { role: string }) => row.role) as UserRole[];
}

// Get current session with all roles
export async function getCurrentSession() {
  const timeoutMs = 25000; // Increased to 25s for better resilience
  const timeoutPromise = new Promise<{ user: null; error: string; isTimeout?: boolean }>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      const err = new Error("Session check timed out");
      (err as any).isTimeout = true;
      reject(err);
    }, timeoutMs);
  });

  const sessionPromise = (async () => {
    try {
      console.log("auth.ts: Fetching session from Supabase...");
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("auth.ts: getSession error:", error);
        return { user: null, error: error.message, isTimeout: false };
      }

      if (!session) {
        console.log("auth.ts: No active session found.");
        return { user: null, error: "No active session", isTimeout: false };
      }

      const { user } = session;
      console.log("auth.ts: Session found for user:", user.id, "Fetching roles...");

      const roles = await getUserRoles(user.id);
      console.log("auth.ts: Roles fetched:", roles);

      return {
        user: {
          id: user.id,
          email: user.email || "",
          roles,
        },
        error: null,
        isTimeout: false,
      };
    } catch (err) {
      console.error("auth.ts: Unexpected error in sessionPromise:", err);
      throw err;
    }
  })();

  try {
    return await Promise.race([sessionPromise, timeoutPromise]);
  } catch (err: any) {
    console.error("auth.ts: getCurrentSession failed or timed out:", err);
    return {
      user: null,
      error: err.message || "Failed to get session",
      isTimeout: err.isTimeout || false
    };
  }
}

// Validate admin before operation
export async function validateAdminAccess(): Promise<{ isValid: boolean; error: string | null }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { isValid: false, error: "আপনি লগইন করেননি" };
    }

    const isAdmin = await checkAdminRole(session.user.id);

    if (!isAdmin) {
      return { isValid: false, error: "আপনার এডমিন অনুমতি নেই" };
    }

    return { isValid: true, error: null };
  } catch (err) {
    return { isValid: false, error: "অনুমতি যাচাই ব্যর্থ হয়েছে" };
  }
}

// Login with admin check
export async function loginAsAdmin(email: string, password: string) {
  const timeoutPromise = new Promise<{ success: boolean; error: string }>((_, reject) => {
    setTimeout(() => reject(new Error("Login timed out after 15 seconds")), 15000);
  });

  const loginPromise = (async () => {
    try {
      console.log("auth.ts: Starting login process for:", email);

      // Validate email and password format
      if (!email || !password) {
        return { success: false, error: "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন" };
      }

      console.log("auth.ts: Calling Supabase signInWithPassword...");
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("auth.ts: Supabase signIn error:", signInError);
        return {
          success: false,
          error: signInError.message === "Invalid login credentials"
            ? "ভুল ইমেইল বা পাসওয়ার্ড"
            : "লগইন ব্যর্থ হয়েছে: " + signInError.message,
        };
      }

      if (!data.user) {
        console.error("auth.ts: No user returned after successful signIn");
        return { success: false, error: "লগইন ব্যর্থ হয়েছে" };
      }

      console.log("auth.ts: Login successful for user:", data.user.id, ". Checking admin role...");

      // Check admin role
      const isAdmin = await checkAdminRole(data.user.id);
      console.log("auth.ts: Role check result:", isAdmin);

      if (!isAdmin) {
        console.warn("auth.ts: User is not an admin, signing out...");
        await supabase.auth.signOut();
        return {
          success: false,
          error: "আপনার এডমিন অনুমতি নেই. শুধুমাত্র এডমিনরাই লগইন করতে পারবেন।",
        };
      }

      console.log("auth.ts: Login process completed successfully.");
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || "",
          role: "admin" as UserRole,
        },
        error: null,
      };
    } catch (err) {
      console.error("auth.ts: Unexpected error in loginPromise:", err);
      throw err;
    }
  })();

  try {
    return await Promise.race([loginPromise, timeoutPromise]);
  } catch (err: any) {
    console.error("auth.ts: Login failed or timed out:", err);
    return {
      success: false,
      error: err.message || "লগইন প্রক্রিয়ায় সমস্যা হয়েছে",
    };
  }
}

// Logout
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: "লগআউট ব্যর্থ হয়েছে" };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: "লগআউটে সমস্যা হয়েছে" };
  }
}