import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
}

export function PrivateRoute({
  children,
  requiredRole = "user",
}: PrivateRouteProps) {
  const { isLoading, user } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check role if required
  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
