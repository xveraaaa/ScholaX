// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  
  console.log("ProtectedRoute - Checking access:");
  console.log("Token exists:", !!token);
  console.log("User string:", userString);
  
  if (!token) {
    console.log("No token, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
    console.log("Parsed user:", user);
  } catch (error) {
    console.error("Error parsing user:", error);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
  
  if (!user || user.role !== allowedRole) {
    console.log(`Access denied. Expected: ${allowedRole}, Got: ${user?.role}`);
    
    // Redirect to appropriate dashboard if user exists but wrong role
    if (user?.role === "admin") {
      console.log("Redirecting to /admin/dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === "FACULTY") {
      console.log("Redirecting to /faculty/dashboard");
      return <Navigate to="/faculty/dashboard" replace />;
    }
    if (user?.role === "STUDENT") {
      console.log("Redirecting to /student/dashboard");
      return <Navigate to="/student/dashboard" replace />;
    }
    
    return <Navigate to="/" replace />;
  }
  
  console.log("Access granted");
  return children;
}