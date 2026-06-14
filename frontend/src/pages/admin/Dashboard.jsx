import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  FaUserGraduate,
  FaChalkboard,
  FaBookOpen,
  FaLayerGroup,
  FaCalendarCheck,
  FaSchool,
  FaUsers,
  FaChartLine,
  FaDownload,
  FaEye,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    programs: 0,
    campuses: 0,
    enrollments: 0,
    pendingGrades: 0,
    todayAttendance: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [enrollmentTrend, setEnrollmentTrend] = useState([]);
  const [programDistribution, setProgramDistribution] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ present: 0, absent: 0, late: 0 });

  useEffect(() => {
    document.title = "Admin Dashboard | ScholaX";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/dashboard/admin");
      
      setStats({
        students: res.data.stats?.students || 0,
        teachers: res.data.stats?.teachers || 0,
        courses: res.data.stats?.courses || 0,
        programs: res.data.stats?.programs || 0,
        campuses: res.data.stats?.campuses || 1,
        enrollments: res.data.stats?.enrollments || 0,
        pendingGrades: res.data.pendingGrades || 0,
        todayAttendance: res.data.todayAttendance || 0,
      });
      
      setRecentStudents(res.data.recentStudents || []);
      setRecentEnrollments(res.data.recentEnrollments || []);
      setEnrollmentTrend(res.data.enrollmentTrend || []);
      setProgramDistribution(res.data.programDistribution || []);
      setAttendanceData(res.data.attendanceData || { present: 0, absent: 0, late: 0 });
      
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Students", value: stats.students, icon: <FaUserGraduate />, color: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-600", link: "/admin/students" },
    { title: "Total Teachers", value: stats.teachers, icon: <FaChalkboard />, color: "bg-green-500", bg: "bg-green-50", text: "text-green-600", link: "/admin/teachers" },
    { title: "Total Courses", value: stats.courses, icon: <FaBookOpen />, color: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-600", link: "/admin/courses" },
    { title: "Programs", value: stats.programs, icon: <FaLayerGroup />, color: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-600", link: "/admin/programs" },
    { title: "Campuses", value: stats.campuses, icon: <FaSchool />, color: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600", link: "/admin/campuses" },
    { title: "Enrollments", value: stats.enrollments, icon: <FaCalendarCheck />, color: "bg-pink-500", bg: "bg-pink-50", text: "text-pink-600", link: "/admin/enrollments" },
  ];

  const chartData = {
    labels: enrollmentTrend.map(item => item.period || item.month),
    datasets: [
      {
        label: "Enrollments",
        data: enrollmentTrend.map(item => item.count),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: programDistribution.map(p => p.program_name),
    datasets: [
      {
        data: programDistribution.map(p => p.count),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
        borderWidth: 0,
      },
    ],
  };

  const attendanceChartData = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        data: [attendanceData.present, attendanceData.absent, attendanceData.late],
        backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Admin! 👋</h1>
              <p className="text-blue-100 mt-1">Here's what's happening with your school today.</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition">
                <FaDownload /> Export Report
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-sm text-blue-100">Active Students</p>
              <p className="text-2xl font-bold">{stats.students}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-sm text-blue-100">Active Courses</p>
              <p className="text-2xl font-bold">{stats.courses}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-sm text-blue-100">This Month</p>
              <p className="text-2xl font-bold">{stats.enrollments}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
              <p className="text-sm text-blue-100">Completion Rate</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.link)}
              className="bg-white rounded-xl border p-4 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center ${card.text}`}>
                  {card.icon}
                </div>
                <FaArrowRight className="text-gray-300 group-hover:text-gray-500 text-sm" />
              </div>
              <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Trend */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Enrollment Trend</h2>
              <FaChartLine className="text-gray-400" />
            </div>
            <div className="h-64">
              {enrollmentTrend.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Program Distribution */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Student Distribution by Program</h2>
              <FaUsers className="text-gray-400" />
            </div>
            <div className="h-64">
              {programDistribution.length > 0 ? (
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Overview */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Today's Attendance</h2>
              <FaCalendarCheck className="text-gray-400" />
            </div>
            <div className="h-48">
              <Pie data={attendanceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">{attendanceData.present}</p>
                <p className="text-xs text-gray-500">Present</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">{attendanceData.absent}</p>
                <p className="text-xs text-gray-500">Absent</p>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-600">{attendanceData.late}</p>
                <p className="text-xs text-gray-500">Late</p>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Pending Tasks</h2>
              <FaExclamationTriangle className="text-yellow-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Pending Grades</p>
                  <p className="text-xs text-gray-500">{stats.pendingGrades} courses need grading</p>
                </div>
                <span className="text-yellow-600 font-bold">{stats.pendingGrades}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Enrollment Requests</p>
                  <p className="text-xs text-gray-500">Awaiting approval</p>
                </div>
                <span className="text-blue-600 font-bold">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Attendance Records</p>
                  <p className="text-xs text-gray-500">Need to be submitted</p>
                </div>
                <span className="text-purple-600 font-bold">8</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Quick Actions</h2>
              <FaCheckCircle className="text-green-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/admin/students")}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 transition"
              >
                <FaUserGraduate className="text-blue-500 mb-1" />
                <p className="text-sm font-medium">Add Student</p>
              </button>
              <button
                onClick={() => navigate("/admin/teachers")}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 transition"
              >
                <FaChalkboard className="text-green-500 mb-1" />
                <p className="text-sm font-medium">Add Teacher</p>
              </button>
              <button
                onClick={() => navigate("/admin/courses")}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 transition"
              >
                <FaBookOpen className="text-purple-500 mb-1" />
                <p className="text-sm font-medium">Add Course</p>
              </button>
              <button
                onClick={() => navigate("/admin/enrollments")}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 transition"
              >
                <FaCalendarCheck className="text-pink-500 mb-1" />
                <p className="text-sm font-medium">Enroll Student</p>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Students & Enrollments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Recently Added Students</h2>
              <button
                onClick={() => navigate("/admin/students")}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View All <FaArrowRight className="text-xs" />
              </button>
            </div>
            <div className="divide-y">
              {recentStudents.slice(0, 5).map((student) => (
                <div key={student.id} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{student.first_name} {student.last_name}</p>
                    <p className="text-xs text-gray-500">{student.student_id} • {student.email}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
              {recentStudents.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-400">No students yet</div>
              )}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Recent Enrollments</h2>
              <button
                onClick={() => navigate("/admin/enrollments")}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View All <FaArrowRight className="text-xs" />
              </button>
            </div>
            <div className="divide-y">
              {recentEnrollments.slice(0, 5).map((enrollment) => (
                <div key={enrollment.id} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{enrollment.student_name}</p>
                    <p className="text-xs text-gray-500">{enrollment.course_code} • {enrollment.academic_period}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    enrollment.status === 'enrolled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
              {recentEnrollments.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-400">No enrollments yet</div>
              )}
            </div>
          </div>
        </div>

        {/* System Info Footer */}
        <div className="bg-gray-50 rounded-xl p-4 text-center text-xs text-gray-400">
          <p>ScholaX SIS v1.0 • Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </AdminLayout>
  );
}