import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  let role = "user";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    role = user?.role || "user";
  } catch {
    /* ignore */
  }
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "superadmin") return <Navigate to="/dashboards" replace />;
  return children;
}
