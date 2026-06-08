import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUserGraduate,
  faChalkboardUser,
  faBook,
  faEnvelope,
  faStar,
  faCalendarCheck,
  faRightFromBracket,
  faBars,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: faChartLine, label: "Dashboard" },
    { path: "/admin/students", icon: faUserGraduate, label: "Students" },
    { path: "/admin/teachers", icon: faChalkboardUser, label: "Teachers" },
    { path: "/admin/courses", icon: faBook, label: "Courses" },
    { path: "/admin/enrollments", icon: faEnvelope, label: "Enrollments" },
    { path: "/admin/grades", icon: faStar, label: "Grades" },
    { path: "/admin/attendance", icon: faCalendarCheck, label: "Attendance" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        
      </div>
    </aside>
  );
}