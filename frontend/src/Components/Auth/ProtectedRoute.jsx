import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token, role } = useAuthStore();

  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  if (!token && !storedToken) {
    return <Navigate to="/" />;
  }

  const currentRole = role || storedRole;
  const isParentPath = location.pathname.includes("/parent");
  const isTeacherPath = location.pathname.includes("/teacher");

  if ((isParentPath && currentRole !== "parent") || (isTeacherPath && currentRole !== "teacher")) {
    return <Navigate to={role ? `/${role}/dashboard` : "/"} />;
;
;
  }

  return children;
};


export default ProtectedRoute;