import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
        : "hover:text-blue-600"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <h1 className="text-2xl font-bold text-blue-900">ScholaX</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
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

            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-700 text-white px-4 py-2 rounded-lg"
                  : "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              }
            >
              Login
            </NavLink>
          </div>

          {/* Mobile Button */}
          <button className="lg:hidden text-3xl" onClick={() => setOpen(!open)}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/programs" onClick={() => setOpen(false)}>
              Programs
            </Link>
            <Link to="/admissions" onClick={() => setOpen(false)}>
              Admissions
            </Link>
            <Link to="/campus-tour" onClick={() => setOpen(false)}>
              Campus Tour
            </Link>
            <Link to="/news" onClick={() => setOpen(false)}>
              News
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <Link to="/faq" onClick={() => setOpen(false)}>
              FAQ
            </Link>

            <Link
              to="/login"
              className="bg-blue-600 text-white text-center py-2 rounded-lg"
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
