import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Also check for token
  const token = localStorage.getItem("token");

  // If no user OR no token, redirect to login
  if (!user || !token) {
    localStorage.clear(); // Clear any corrupted data
    return <Navigate to="/login" />;
  }

  // If role doesn't match, redirect to home
  if (user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}