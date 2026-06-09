import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

// FA Icons
import {
  FaUserGraduate,
  FaChalkboardUser,
  FaBookOpen,
  FaLayerGroup,
  FaCalendarCheck,
  FaBullhorn,
} from "react-icons/fa6";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    enrollments: 0,
    enrolledStudents: 0,
    programs: 0,
    campuses: 0,
  });

  const [activities, setActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin Dashboard";

    api
      .get("/dashboard/admin")
      .then((res) => {
        setStats(
          res.data.stats || {
            students: 0,
            teachers: 0,
            courses: 0,
            enrollments: 0,
            enrolledStudents: 0,
            programs: 0,
            campuses: 0,
          }
        );

        setActivities(res.data.activities || []);
        setAnnouncements(res.data.announcements || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Loading Dashboard...</p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we load your data
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.students,
      icon: <FaUserGraduate />,
    },
    {
      title: "Total Teachers",
      value: stats.teachers,
      icon: <FaChalkboardUser />,
    },
    {
      title: "Courses",
      value: stats.courses,
      icon: <FaBookOpen />,
    },
    {
      title: "Programs",
      value: stats.programs,
      icon: <FaLayerGroup />,
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {/* Welcome */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back,{" "}
              {localStorage.getItem("username") || "Admin"} 👋
            </h2>
            <p className="text-gray-500 mt-2">
              Here's what's happening with your learning platform today.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-slate-500 text-sm">{card.title}</p>
              <h2 className="text-3xl font-bold mt-2">
                {card.value.toLocaleString()}
              </h2>
            </div>

            <div className="text-3xl text-blue-600">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Activities + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Activities */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-sm font-medium">Date</th>
                <th className="text-left py-3 text-sm font-medium">
                  Activity
                </th>
              </tr>
            </thead>

            <tbody>
              {activities.length > 0 ? (
                activities.slice(0, 5).map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 text-sm">{item.date}</td>
                    <td className="py-3 text-sm">{item.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="py-8 text-center text-gray-500"
                  >
                    No recent activities
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/students")}
              className="rounded-xl border p-4 hover:bg-gray-50 transition flex flex-col items-center gap-2"
            >
              <FaUserGraduate className="text-xl text-blue-600" />
              Add Student
            </button>

            <button
              onClick={() => navigate("/admin/teachers")}
              className="rounded-xl border p-4 hover:bg-gray-50 transition flex flex-col items-center gap-2"
            >
              <FaChalkboardUser className="text-xl text-teal-600" />
              Add Teacher
            </button>

            <button
              onClick={() => navigate("/admin/courses")}
              className="rounded-xl border p-4 hover:bg-gray-50 transition flex flex-col items-center gap-2"
            >
              <FaBookOpen className="text-xl text-amber-600" />
              Add Course
            </button>

            <button
              onClick={() => navigate("/admin/announcements")}
              className="rounded-xl border p-4 hover:bg-gray-50 transition flex flex-col items-center gap-2"
            >
              <FaBullhorn className="text-xl text-red-600" />
              Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">
          Latest Announcements
        </h3>

        {announcements.length > 0 ? (
          announcements.slice(0, 3).map((item, index) => (
            <div key={index} className="border-b last:border-0 py-4">
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-gray-500 text-sm mt-1">
                {item.message}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No announcements available
          </div>
        )}
      </div>
    </AdminLayout>
  );
}