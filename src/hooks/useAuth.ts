import { useAuthContext } from "@/components/auth/AuthProvider";

export function useAuth() {
  const context = useAuthContext();
  return context;
}
