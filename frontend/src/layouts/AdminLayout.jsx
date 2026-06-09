import { useState } from "react";

import AdminNavbar from "../components/admin/Navbar";
import AdminSidebar from "../components/admin/Sidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar
        toggleSidebar={() => setCollapsed(!collapsed)}
      />

      <div className="flex">
        <AdminSidebar collapsed={collapsed} />

        <main
          className={`
            flex-1
            transition-all
            duration-300
            p-8
            ${collapsed ? "ml-20" : "ml-64"}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}