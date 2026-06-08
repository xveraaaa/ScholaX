import { useNavigate } from "react-router-dom";
// import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar">
      <h3>Admin Panel</h3>

      <button onClick={logout}>
        Logout
      </button>
    </header>
  );
}