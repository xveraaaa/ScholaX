import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHouse,
  FaUserGraduate,
  FaChalkboardUser,
  FaBookOpen,
  FaLayerGroup,
  FaBuilding,
  FaClipboardList,
  FaChartLine,
  FaCalendarCheck,
  FaBullhorn,
 
} from "react-icons/fa6";

import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
const menu = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        icon: FaHouse,
        path: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Students",
        icon: FaUserGraduate,
        path: "/admin/students",
      },
      {
        name: "Teachers",
        icon: FaChalkboardUser,
        path: "/admin/teachers",
      },
      {
        name: "Courses",
        icon: FaBookOpen,
        path: "/admin/courses",
      },
      {
        name: "Programs",
        icon: FaLayerGroup,
        path: "/admin/programs",
      },
      {
        name: "Campuses",
        icon: FaBuilding,
        path: "/admin/campuses",
      },
      {
        name: "Enrollments",
        icon: FaClipboardList,
        path: "/admin/enrollments",
      },
    ],
  },
  {
    title: "Tracking",
    items: [
      {
        name: "Grades",
        icon: FaChartLine,
        path: "/admin/grades",
      },
      {
        name: "Attendance",
        icon: FaCalendarCheck,
        path: "/admin/attendance",
      },
      {
        name: "Announcements",
        icon: FaBullhorn,
        path: "/admin/announcements",
      },
    ],
  },
];

export default function AdminSidebar({ collapsed }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "Admin";

  const onLogout = () => {
    localStorage.clear();

    toast.success("Logged out");

    navigate("/login", { replace: true });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };
  return (
    <aside
      className={`
        fixed
        top-16
        left-0
        bottom-0
        bg-white
        border-r
        border-slate-200
        overflow-hidden
        transition-all
        duration-300
        z-40
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      <div className="h-full overflow-y-auto px-2 py-4">
        {menu.map((section) => (
          <div key={section.title} className="mb-6">
            <div
              className={`
                px-3
                pb-2
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
                transition-opacity
                duration-200
                ${collapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}
              `}
            >
              {section.title}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    ${collapsed ? "justify-center" : "gap-3"}
                    px-3
                    py-2.5
                    rounded-xl
                    mb-1
                    text-sm
                    font-medium
                    transition-all
                    duration-150
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }
                  `
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  <span
                    className={`
                      transition-all
                      duration-200
                      whitespace-nowrap
                      overflow-hidden
                      ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                    `}
                  >
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </div>
        ))}
        <div className="p-2 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className={`
        w-full
        flex
        items-center
        ${collapsed ? "justify-center" : "gap-3"}
        px-3
        py-2.5
        rounded-xl
        text-sm
        font-medium
        text-red-600
        bg-red-50
        hover:bg-red-100
        transition-all
      `}
          >
            <FaSignOutAlt className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
