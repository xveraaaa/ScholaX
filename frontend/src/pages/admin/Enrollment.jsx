import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaUserPlus } from "react-icons/fa";

export default function Enrollments() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    section_id: "",
    school_year: "",
    academic_period: "",
    status: "enrolled"
  });

  const academicPeriods = ["1st Sem", "2nd Sem", "3rd Trimester", "Summer"];
  const schoolYears = ["2023-2024", "2024-2025", "2025-2026"];

  useEffect(() => {
    document.title = "Enrollments | Admin";
    fetchEnrollments();
    fetchCampuses();
    fetchPrograms();
    fetchCourses();
    fetchSections();
    fetchStudents();
  }, []);

  // Filter enrollments
  useEffect(() => {
    let filtered = [...enrollments];
    
    if (selectedCampus) {
      filtered = filtered.filter(e => e.campus_id == selectedCampus);
    }
    
    if (selectedProgram) {
      filtered = filtered.filter(e => e.program_id == selectedProgram);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.student_name?.toLowerCase().includes(term) ||
        e.student_id?.toLowerCase().includes(term) ||
        e.course_code?.toLowerCase().includes(term) ||
        e.course_name?.toLowerCase().includes(term) ||
        e.section_code?.toLowerCase().includes(term)
      );
    }
    
    setFilteredEnrollments(filtered);
  }, [selectedCampus, selectedProgram, searchTerm, enrollments]);

  // Filter programs based on campus
  useEffect(() => {
    if (selectedCampus) {
      const filtered = programs.filter(p => p.campus_id == selectedCampus);
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms([]);
    }
    setSelectedProgram("");
  }, [selectedCampus, programs]);

  // Filter courses based on program
  useEffect(() => {
    if (selectedProgram) {
      const filtered = courses.filter(c => c.program_id == selectedProgram);
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
    setFormData(prev => ({ ...prev, course_id: "", section_id: "" }));
  }, [selectedProgram, courses]);

  // Filter sections based on course
  useEffect(() => {
    if (formData.course_id) {
      const filtered = sections.filter(s => s.course_id == formData.course_id);
      setFilteredSections(filtered);
    } else {
      setFilteredSections([]);
    }
    setFormData(prev => ({ ...prev, section_id: "" }));
  }, [formData.course_id, sections]);

  // Filter students based on section (only students not already enrolled)
  useEffect(() => {
    if (formData.section_id) {
      // Get student IDs already enrolled in this section
      const enrolledStudentIds = enrollments
        .filter(e => e.section_id == formData.section_id && e.status === 'enrolled')
        .map(e => e.student_id);
      
      const filtered = students.filter(s => 
        s.section_id == formData.section_id && 
        !enrolledStudentIds.includes(s.id)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
    setFormData(prev => ({ ...prev, student_id: "" }));
  }, [formData.section_id, students, enrollments]);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollments");
      setEnrollments(res.data);
      setFilteredEnrollments(res.data);
    } catch (error) {
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  const fetchCampuses = async () => {
    try {
      const res = await api.get("/campuses");
      setCampuses(res.data);
    } catch (error) {
      console.error("Failed to fetch campuses", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/programs");
      setPrograms(res.data);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await api.get("/sections");
      setSections(res.data);
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/enrollments", formData);
      toast.success("Student enrolled successfully");
      setShowModal(false);
      resetForm();
      fetchEnrollments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to drop this enrollment?")) {
      try {
        await api.delete(`/enrollments/${id}`);
        toast.success("Enrollment dropped successfully");
        fetchEnrollments();
      } catch (error) {
        toast.error("Failed to drop enrollment");
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/enrollments/${id}`, { status });
      toast.success(`Enrollment ${status}`);
      fetchEnrollments();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setSelectedCampus("");
    setSelectedProgram("");
    setFormData({
      student_id: "",
      course_id: "",
      section_id: "",
      school_year: schoolYears[0],
      academic_period: academicPeriods[0],
      status: "enrolled"
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const clearFilters = () => {
    setSelectedCampus("");
    setSelectedProgram("");
    setSearchTerm("");
  };

  const getStatusBadge = (status) => {
    const colors = {
      enrolled: "bg-green-100 text-green-700",
      dropped: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'enrolled': return <FaClock className="text-green-500" />;
      case 'completed': return <FaCheckCircle className="text-blue-500" />;
      case 'dropped': return <FaTimesCircle className="text-red-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading enrollments...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Enrollments</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> New Enrollment
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">All Campuses</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.campus_name}
                </option>
              ))}
            </select>

            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="border rounded-lg px-4 py-2"
              disabled={!selectedCampus}
            >
              <option value="">All Programs</option>
              {filteredPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.program_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredEnrollments.length} of {enrollments.length} enrollments
            </div>
            {(selectedCampus || selectedProgram || searchTerm) && (
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Course</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Section</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">School Year</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Period</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium">{enrollment.student_first} {enrollment.student_last}</p>
                        <p className="text-xs text-gray-500">{enrollment.student_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p>{enrollment.course_code}</p>
                        <p className="text-xs text-gray-500">{enrollment.course_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {enrollment.section_code || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{enrollment.school_year}</td>
                    <td className="px-6 py-4 text-sm">{enrollment.academic_period}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(enrollment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {enrollment.status === 'enrolled' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(enrollment.id, 'completed')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Mark Completed"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(enrollment.id, 'dropped')}
                              className="text-red-600 hover:text-red-800"
                              title="Drop"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(enrollment.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEnrollments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No enrollments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">New Enrollment</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Step 1: Campus */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-blue-600">
                    Step 1: Select Campus *
                  </label>
                  <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Campus</option>
                    {campuses.map((campus) => (
                      <option key={campus.id} value={campus.id}>
                        {campus.campus_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Program */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-green-600">
                    Step 2: Select Program *
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={!selectedCampus}
                    required
                  >
                    <option value="">Select Program</option>
                    {filteredPrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.program_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: Course */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-purple-600">
                    Step 3: Select Course *
                  </label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={!selectedProgram}
                    required
                  >
                    <option value="">Select Course</option>
                    {filteredCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.course_code} - {course.course_name} ({course.credits} credits)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 4: Section */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-orange-600">
                    Step 4: Select Section *
                  </label>
                  <select
                    value={formData.section_id}
                    onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={!formData.course_id}
                    required
                  >
                    <option value="">Select Section</option>
                    {filteredSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.section_code} - {section.schedule || "TBA"} ({section.current_students || 0}/{section.max_students} students)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 5: Student */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-pink-600">
                    Step 5: Select Student *
                  </label>
                  <select
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={!formData.section_id}
                    required
                  >
                    <option value="">Select Student</option>
                    {filteredStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.student_id} - {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </select>
                  {formData.section_id && filteredStudents.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">No available students in this section</p>
                  )}
                </div>

                {/* Step 6: Enrollment Details */}
                <div className="col-span-2">
                  <hr className="my-2" />
                  <label className="block text-sm font-medium mb-1 text-cyan-600">
                    Step 6: Enrollment Details
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">School Year *</label>
                  <select
                    value={formData.school_year}
                    onChange={(e) => setFormData({ ...formData, school_year: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    {schoolYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Academic Period *</label>
                  <select
                    value={formData.academic_period}
                    onChange={(e) => setFormData({ ...formData, academic_period: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    {academicPeriods.map((period) => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="enrolled">Enrolled</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCampus || !selectedProgram || !formData.course_id || !formData.section_id || !formData.student_id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaUserPlus /> Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}