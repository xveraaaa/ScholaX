import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import About from "./pages/home/About";
import Programs from "./pages/home/Programs";
import Contact from "./pages/home/Contact";
import FAQ from "./pages/home/FAQ";
import CampusTour from "./pages/home/CampusTour";

import ProtectedRoute from "./components/ProtectedRoute";

// import AdminDashboard from "./pages/admin/Dashboard";
// import FacultyDashboard from "./pages/faculty/Dashboard";
// import StudentDashboard from "./pages/student/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/campus-tour" element={<CampusTour />} />



        

        {/* <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRole="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

        <Route
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
