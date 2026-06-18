import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

import ilogo from "../../assets/home/ilogo.jpeg";

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
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="relative rounded-[32px] border border-slate-200/70 bg-white/90 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-5 py-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                <img 
                  src={ilogo} 
                  alt="ICCT Colleges Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-950">
                  <span className="text-blue-600">ICCT</span>
                </h1>
                <p className="text-sm font-semibold  tracking-[0.25em] text-slate-500">Colleges</p>
                
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100/80 px-2 py-1 shadow-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                      isActive
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-950 hover:bg-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden items-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-sky-600 lg:flex"
              >
                Login
              </Link>

              <button
                onClick={() => setOpen(!open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
                aria-label="Toggle navigation"
              >
                {open ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {open && (
            <div className="lg:hidden border-t border-slate-200/80 bg-white/95 p-4 backdrop-blur-xl">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-base font-medium transition ${
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
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-center text-base font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
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
