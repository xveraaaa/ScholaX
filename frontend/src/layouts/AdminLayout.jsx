import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

export default function AdminLayout({
  children
}) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />
        {children}
      </div>
    </div>
  );
}