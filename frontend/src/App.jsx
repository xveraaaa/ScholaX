import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";

import AdminDashboard from "./pages/admin/Dashboard";
// import FacultyDashboard from "./pages/faculty/Dashboard";
// import StudentDashboard from "./pages/student/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRole="FACULTY">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
