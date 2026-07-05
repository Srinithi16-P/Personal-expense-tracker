import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/ui/Spinner";

export const ProtectedRoute = () => {
  const { admin, loading } = useAuth();
  if (loading) return <PageLoader />;
  return admin ? <Outlet /> : <Navigate to="/login" replace />;
};
