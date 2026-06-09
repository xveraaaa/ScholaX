import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaBars,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "Admin";

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("user");

    toast.success("Logged out");

    navigate("/login", { replace: true });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  return (
    <header
      className="
        h-16
        bg-[#042C53]
        border-b
        border-white/10
        flex
        items-center
        justify-between
        px-6
        sticky
        top-0
        z-50
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="
            w-9
            h-9
            rounded-lg
            bg-white/10
            text-white
            flex
            items-center
            justify-center
            hover:bg-white/20
            transition
          "
        >
          <FaBars />
        </button>

        <h1 className="text-lg font-bold text-white tracking-tight">
          Schola
          <span className="text-blue-200 font-normal">
            {""}
            X
          </span>
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          className="
            relative
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-white/10
            text-white
            text-sm
            font-medium
            hover:bg-white/20
            transition
          "
        >
          <FaBell />

          <span className="hidden md:inline">
            Notifications
          </span>

          <span
            className="
              w-2
              h-2
              rounded-full
              bg-amber-400
              animate-pulse
            "
          />
        </button>

        <div
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-white/10
            text-white
            text-sm
            font-medium
          "
        >
          <FaUser />
          <span>{username}</span>
        </div>

        
      </div>
    </header>
  );
}