import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function useAdminProtect() {
  const navigate = useNavigate();
  const { isLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isLoading, isAdmin, navigate]);

  return { isLoading, isAdmin };
}