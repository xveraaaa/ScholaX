import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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