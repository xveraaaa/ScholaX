// src/pages/admin/Dashboard.jsx

import AdminLayout from "../../layouts/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>

      <div>
        <div>Total Students</div>
        <div>Total Teachers</div>
        <div>Total Courses</div>
        <div>Total Enrollments</div>
      </div>
    </AdminLayout>
  );
}