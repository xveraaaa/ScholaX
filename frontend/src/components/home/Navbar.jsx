import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Admissions", path: "/admissions" },
  { name: "Campus Tour", path: "/campus-tour" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-slate-900">Schola</span>
                <span className="text-blue-600">X</span>
              </h1>
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full p-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden lg:flex items-center px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Login
              </Link>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden text-3xl text-slate-800"
              >
                {open ? <HiX /> : <HiMenu />}
              </button>
            </div>
          </div>

          {/* Mobile */}
          {open && (
            <div className="lg:hidden border-t border-slate-200 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl font-medium ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}

                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 bg-blue-600 text-white text-center py-3 rounded-xl font-semibold"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}