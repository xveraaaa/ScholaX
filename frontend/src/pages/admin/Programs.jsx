import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaUniversity } from "react-icons/fa";

export default function Programs() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    program_code: "",
    program_name: "",
    description: "",
    duration_years: 4,
    campus_id: "",
    status: "active"
  });

  useEffect(() => {
    document.title = "Programs | Admin";
    fetchPrograms();
    fetchCampuses();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/programs");
      setPrograms(res.data);
    } catch (error) {
      toast.error("Failed to fetch programs");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await api.put(`/programs/${editingProgram.id}`, formData);
        toast.success("Program updated successfully");
      } else {
        await api.post("/programs", formData);
        toast.success("Program created successfully");
      }
      setShowModal(false);
      resetForm();
      fetchPrograms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program? This will affect students in this program.")) {
      try {
        await api.delete(`/programs/${id}`);
        toast.success("Program deleted successfully");
        fetchPrograms();
      } catch (error) {
        toast.error("Failed to delete program");
      }
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setFormData({
      program_code: "",
      program_name: "",
      description: "",
      duration_years: 4,
      campus_id: "",
      status: "active"
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (program) => {
    setEditingProgram(program);
    setFormData({
      program_code: program.program_code,
      program_name: program.program_name,
      description: program.description || "",
      duration_years: program.duration_years,
      campus_id: program.campus_id || "",
      status: program.status
    });
    setShowModal(true);
  };

  const getCampusName = (campusId) => {
    const campus = campuses.find(c => c.id == campusId);
    return campus?.campus_name || "N/A";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Loading Programs...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Programs</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Program
          </button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FaUniversity className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{program.program_name}</h3>
                    <p className="text-sm text-gray-500">{program.program_code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  program.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {program.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                {program.description && (
                  <p className="text-gray-600 line-clamp-2">{program.description}</p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Duration:</span> {program.duration_years} {program.duration_years === 1 ? 'year' : 'years'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Campus:</span> 
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {getCampusName(program.campus_id)}
                  </span>
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => openEditModal(program)}
                  className="text-green-600 hover:text-green-800 p-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          
          {programs.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No programs found
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingProgram ? "Edit Program" : "Add New Program"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Program Code *</label>
                  <input
                    type="text"
                    value={formData.program_code}
                    onChange={(e) => setFormData({ ...formData, program_code: e.target.value.toUpperCase() })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., BSIT, BSCS, BSA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Program Name *</label>
                  <input
                    type="text"
                    value={formData.program_name}
                    onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Bachelor of Science in Information Technology"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                    placeholder="Program description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration (Years)</label>
                  <select
                    value={formData.duration_years}
                    onChange={(e) => setFormData({ ...formData, duration_years: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={2}>2 years</option>
                    <option value={3}>3 years</option>
                    <option value={4}>4 years</option>
                    <option value={5}>5 years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Campus *</label>
                  <select
                    value={formData.campus_id}
                    onChange={(e) => setFormData({ ...formData, campus_id: e.target.value })}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProgram ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}