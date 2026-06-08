// src/pages/auth/Login.jsx - Fix navigation paths
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", form);
      
      const res = await api.post("/auth/login", form);
      
      console.log("Login response:", res.data);

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;
        console.log("User role:", role);

        // IMPORTANT: Use exact paths that match your routes
        if (role === "ADMIN") {
          console.log("Navigating to /admin/dashboard");
          navigate("/admin/dashboard");  // Make sure this matches the route
        } else if (role === "FACULTY") {
          console.log("Navigating to /faculty/dashboard");
          navigate("/faculty/dashboard");
        } else if (role === "STUDENT") {
          console.log("Navigating to /student/dashboard");
          navigate("/student/dashboard");
        } else {
          setError("Unknown user role");
        }
      } else {
        setError("Invalid response from server");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>ScholaX Login</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          padding: "10px", 
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Username"
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value
              })
            }
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Password"
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}