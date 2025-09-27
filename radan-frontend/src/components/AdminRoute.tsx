import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router";

const AdminRoute = () => {
  const role = useAuthStore((state) => state.role);

  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
