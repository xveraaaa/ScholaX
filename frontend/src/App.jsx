import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import About from "./pages/home/About";
import Programs from "./pages/home/Programs";
import Contact from "./pages/home/Contact";
import FAQ from "./pages/home/FAQ";
import CampusTour from "./pages/home/CampusTour";
import News from "./pages/home/News";
import Privacy from "./pages/home/Privacy";
import Terms from "./pages/home/Terms";
import Admissions from "./pages/home/Admissions";
import Login from "./pages/home/Login";
import ForgotPassword from "./pages/home/ForgotPassword";

import NotFound from "./pages/public/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Campuses from "./pages/admin/Campus";
import AdminPrograms from "./pages/admin/Programs";

// import FacultyDashboard from "./pages/faculty/Dashboard";
// import StudentDashboard from "./pages/student/Dashboard";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/campus-tour" element={<CampusTour />} />
          <Route path="/news" element={<News />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/campuses" element={<Campuses />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />




          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;
