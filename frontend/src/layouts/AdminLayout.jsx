export default function AdminLayout({
  children
}) {
  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-2xl font-bold">
          ScholaX
        </h1>

        <ul className="mt-8 space-y-4">
          <li>Dashboard</li>
          <li>Students</li>
          <li>Teachers</li>
          <li>Courses</li>
          <li>Enrollments</li>
          <li>Grades</li>
          <li>Attendance</li>
        </ul>
      </aside>

      <main className="flex-1 p-6 bg-slate-100">
        {children}
      </main>

    </div>
  );
}