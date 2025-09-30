import { Navigate, Outlet } from "react-router"; 
import { getActiveUser } from "../utils/auth";

const ProtectedRoute = () => {
  const activeUser = getActiveUser();

  if (!activeUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />
};

export default ProtectedRoute;