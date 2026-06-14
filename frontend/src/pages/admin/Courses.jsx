import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from "react-icons/fa";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    description: "",
    credits: 3,
    program_id: "",
    teacher_id: "",
    campus_id: "",
    semester: 1,
    year_level: 1,
    status: "active"
  });

  useEffect(() => {
    document.title = "Courses | Admin";
    fetchCourses();
    fetchCampuses();
    fetchPrograms();
    fetchTeachers();
  }, []);

  // Filter courses when filters change
  useEffect(() => {
    let filtered = [...courses];
    
    if (selectedCampus) {
      filtered = filtered.filter(c => c.campus_id == selectedCampus);
    }
    
    if (selectedProgram) {
      filtered = filtered.filter(c => c.program_id == selectedProgram);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.course_code?.toLowerCase().includes(term) ||
        c.course_name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredCourses(filtered);
  }, [selectedCampus, selectedProgram, searchTerm, courses]);

  // Filter programs based on selected campus
  useEffect(() => {
    if (selectedCampus) {
      const filtered = programs.filter(p => p.campus_id == selectedCampus);
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms([]);
    }
    setSelectedProgram("");
  }, [selectedCampus, programs]);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (error) {
      toast.error("Failed to fetch courses");
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

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, formData);
        toast.success("Course updated successfully");
      } else {
        await api.post("/courses", formData);
        toast.success("Course created successfully");
      }
      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course? This will affect enrollments.")) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success("Course deleted successfully");
        fetchCourses();
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setSelectedCampus("");
    setSelectedProgram("");
    setFormData({
      course_code: "",
      course_name: "",
      description: "",
      credits: 3,
      program_id: "",
      teacher_id: "",
      campus_id: "",
      semester: 1,
      year_level: 1,
      status: "active"
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setSelectedCampus(course.campus_id || "");
    setSelectedProgram(course.program_id || "");
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description || "",
      credits: course.credits,
      program_id: course.program_id || "",
      teacher_id: course.teacher_id || "",
      campus_id: course.campus_id || "",
      semester: course.semester || 1,
      year_level: course.year_level || 1,
      status: course.status || "active"
    });
    setShowModal(true);
  };

  const clearFilters = () => {
    setSelectedCampus("");
    setSelectedProgram("");
    setSearchTerm("");
  };

  const getCampusName = (campusId) => {
    const campus = campuses.find(c => c.id == campusId);
    return campus?.campus_name || "N/A";
  };

  const getProgramName = (programId) => {
    const program = programs.find(p => p.id == programId);
    return program?.program_name || "N/A";
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id == teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : "Not Assigned";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading courses...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Course
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code or name..."
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
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
            {(selectedCampus || selectedProgram || searchTerm) && (
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Course Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Units</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Program</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Teacher</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{course.course_code}</td>
                    <td className="px-6 py-4 text-sm">{course.course_name}</td>
                    <td className="px-6 py-4 text-sm">{course.credits}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {getProgramName(course.program_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{getTeacherName(course.teacher_id)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/courses/${course.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(course)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>
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
                    onChange={(e) => {
                      setSelectedCampus(e.target.value);
                      setFormData({ ...formData, campus_id: e.target.value });
                    }}
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
                    onChange={(e) => {
                      setSelectedProgram(e.target.value);
                      setFormData({ ...formData, program_id: e.target.value });
                    }}
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

                {/* Step 3: Course Details */}
                <div className="col-span-2">
                  <hr className="my-2" />
                  <label className="block text-sm font-medium mb-1 text-orange-600">
                    Step 3: Course Details
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value.toUpperCase() })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., IT101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Introduction to Programming"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Credits *</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                    min="1"
                    max="6"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teacher</label>
                  <select
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name} - {teacher.teacher_code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Year Level</label>
                  <select
                    value={formData.year_level}
                    onChange={(e) => setFormData({ ...formData, year_level: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={1}>1st Semester</option>
                    <option value={2}>2nd Semester</option>
                    <option value={3}>3rd Trimester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                    placeholder="Course description..."
                  />
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
                  disabled={!selectedCampus || !selectedProgram}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editingCourse ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}