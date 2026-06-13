import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from "react-icons/fa";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    gender: "male",
    date_of_birth: "",
    contact: "",
    address: "",
    campus_id: "",
    program_id: "",
    section_id: ""
  });

  useEffect(() => {
    document.title = "Students | Admin";
    fetchStudents();
    fetchCampuses();
    fetchPrograms();
    fetchSections();
  }, []);

  // Filter students when filters change
  useEffect(() => {
    let filtered = [...students];
    
    if (selectedCampus) {
      filtered = filtered.filter(s => s.campus_id == selectedCampus);
    }
    
    if (selectedProgram) {
      filtered = filtered.filter(s => s.program_id == selectedProgram);
    }
    
    if (selectedSection) {
      filtered = filtered.filter(s => s.section_id == selectedSection);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.student_id?.toLowerCase().includes(term) ||
        s.first_name?.toLowerCase().includes(term) ||
        s.last_name?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.contact?.toLowerCase().includes(term)
      );
    }
    
    setFilteredStudents(filtered);
  }, [selectedCampus, selectedProgram, selectedSection, searchTerm, students]);

  // Filter programs based on selected campus
  useEffect(() => {
    if (selectedCampus) {
      const filtered = programs.filter(p => p.campus_id == selectedCampus);
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms([]);
    }
    setSelectedProgram("");
    setSelectedSection("");
  }, [selectedCampus, programs]);

  // Filter sections based on selected program
  useEffect(() => {
    if (selectedProgram) {
      const filtered = sections.filter(s => s.program_id == selectedProgram);
      setFilteredSections(filtered);
    } else {
      setFilteredSections([]);
    }
    setSelectedSection("");
  }, [selectedProgram, sections]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (error) {
      toast.error("Failed to fetch students");
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

  const fetchSections = async () => {
    try {
      const res = await api.get("/sections");
      setSections(res.data);
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, formData);
        toast.success("Student updated successfully");
      } else {
        await api.post("/students", formData);
        toast.success("Student created successfully");
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        toast.success("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const resetForm = () => {
    setEditingStudent(null);
    setSelectedCampus("");
    setSelectedProgram("");
    setSelectedSection("");
    setFormData({
      student_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      gender: "male",
      date_of_birth: "",
      contact: "",
      address: "",
      campus_id: "",
      program_id: "",
      section_id: ""
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setSelectedCampus(student.campus_id || "");
    setSelectedProgram(student.program_id || "");
    setSelectedSection(student.section_id || "");
    setFormData({
      student_id: student.student_id,
      first_name: student.first_name,
      middle_name: student.middle_name || "",
      last_name: student.last_name,
      email: student.email,
      gender: student.gender,
      date_of_birth: student.date_of_birth.split('T')[0],
      contact: student.contact,
      address: student.address || "",
      campus_id: student.campus_id || "",
      program_id: student.program_id || "",
      section_id: student.section_id || ""
    });
    setShowModal(true);
  };

  const clearFilters = () => {
    setSelectedCampus("");
    setSelectedProgram("");
    setSelectedSection("");
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

  const getSectionName = (sectionId) => {
    const section = sections.find(s => s.id == sectionId);
    return section ? `${section.section_code} - ${section.course_code}` : "N/A";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Loading Students...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Student
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Campus Filter */}
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

            {/* Program Filter */}
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

            {/* Section Filter */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border rounded-lg px-4 py-2"
              disabled={!selectedProgram}
            >
              <option value="">All Sections</option>
              {filteredSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.section_code} - {section.course_code}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Stats */}
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredStudents.length} of {students.length} students
            </div>
            {(selectedCampus || selectedProgram || selectedSection || searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Program</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Section</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{student.student_id}</td>
                    <td className="px-6 py-4 text-sm">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm">{student.email}</td>
                    <td className="px-6 py-4 text-sm">{student.contact}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {getProgramName(student.program_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {getSectionName(student.section_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No students found
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
                {editingStudent ? "Edit Student" : "Add New Student"}
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

                {/* Step 3: Section */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-purple-600">
                    Step 3: Select Section *
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => {
                      setSelectedSection(e.target.value);
                      setFormData({ ...formData, section_id: e.target.value });
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={!selectedProgram}
                    required
                  >
                    <option value="">Select Section</option>
                    {filteredSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.section_code} - {section.course_code} ({section.schedule || "TBA"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 4: Student Details */}
                <div className="col-span-2">
                  <hr className="my-2" />
                  <label className="block text-sm font-medium mb-1 text-orange-600">
                    Step 4: Student Details
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Student ID *</label>
                  <input
                    type="text"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middle_name}
                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact *</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="2"
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
                  disabled={!selectedCampus || !selectedProgram || !selectedSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editingStudent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}