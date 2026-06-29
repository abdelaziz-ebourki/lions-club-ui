import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { PageSkeleton } from "@/components/shared/page-skeleton";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <PageSkeleton />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
