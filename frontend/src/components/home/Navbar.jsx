import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
  : "text-slate-600 hover:text-blue-600"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold">
              <span className="text-slate-900">Schola</span>
              <span className="text-blue-600">X</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            <NavLink to="/programs" className={navLinkClass}>
              Programs
            </NavLink>

            <NavLink to="/admissions" className={navLinkClass}>
              Admissions
            </NavLink>

            <NavLink to="/campus-tour" className={navLinkClass}>
              Campus Tour
            </NavLink>

            <NavLink to="/news" className={navLinkClass}>
              News
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            <NavLink to="/faq" className={navLinkClass}>
              FAQ
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden lg:flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Login
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-3xl"
            >
              {open ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col p-5 gap-4">

            <NavLink to="/" onClick={() => setOpen(false)}>
              Home
            </NavLink>

            <NavLink to="/about" onClick={() => setOpen(false)}>
              About
            </NavLink>

            <NavLink to="/programs" onClick={() => setOpen(false)}>
              Programs
            </NavLink>

            <NavLink to="/admissions" onClick={() => setOpen(false)}>
              Admissions
            </NavLink>

            <NavLink to="/campus-tour" onClick={() => setOpen(false)}>
              Campus Tour
            </NavLink>

            <NavLink to="/news" onClick={() => setOpen(false)}>
              News
            </NavLink>

            <NavLink to="/contact" onClick={() => setOpen(false)}>
              Contact
            </NavLink>

            <NavLink to="/faq" onClick={() => setOpen(false)}>
              FAQ
            </NavLink>

            <Link
              to="/login"
              className="bg-blue-600 text-white text-center py-3 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}