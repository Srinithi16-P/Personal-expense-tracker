import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/ui/Spinner";
import AdminBlocked from "../pages/AdminBlocked";

export const ProtectedRoute = () => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin) return <AdminBlocked />;
  return <Outlet />;
};
