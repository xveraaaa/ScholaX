import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaSchool } from "react-icons/fa";

export default function Campuses() {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampus, setEditingCampus] = useState(null);
  const [formData, setFormData] = useState({
    campus_code: "",
    campus_name: "",
    address: "",
    contact: "",
    email: "",
    status: "active"
  });

  useEffect(() => {
    document.title = "Campuses | Admin";
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const res = await api.get("/campuses");
      setCampuses(res.data);
    } catch (error) {
      toast.error("Failed to fetch campuses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCampus) {
        await api.put(`/campuses/${editingCampus.id}`, formData);
        toast.success("Campus updated successfully");
      } else {
        await api.post("/campuses", formData);
        toast.success("Campus created successfully");
      }
      setShowModal(false);
      resetForm();
      fetchCampuses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this campus?")) {
      try {
        await api.delete(`/campuses/${id}`);
        toast.success("Campus deleted successfully");
        fetchCampuses();
      } catch (error) {
        toast.error("Failed to delete campus");
      }
    }
  };

  const resetForm = () => {
    setEditingCampus(null);
    setFormData({
      campus_code: "",
      campus_name: "",
      address: "",
      contact: "",
      email: "",
      status: "active"
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (campus) => {
    setEditingCampus(campus);
    setFormData({
      campus_code: campus.campus_code,
      campus_name: campus.campus_name,
      address: campus.address || "",
      contact: campus.contact || "",
      email: campus.email || "",
      status: campus.status
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Loading Campuses...</p>
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
          <h1 className="text-3xl font-bold text-slate-900">Campuses</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Campus
          </button>
        </div>

        {/* Campuses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campuses.map((campus) => (
            <div key={campus.id} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FaSchool className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{campus.campus_name}</h3>
                    <p className="text-sm text-gray-500">{campus.campus_code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campus.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {campus.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {campus.address && (
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> {campus.address}
                  </p>
                )}
                {campus.contact && (
                  <p className="text-gray-600">
                    <span className="font-medium">Contact:</span> {campus.contact}
                  </p>
                )}
                {campus.email && (
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {campus.email}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => openEditModal(campus)}
                  className="text-green-600 hover:text-green-800 p-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(campus.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          
          {campuses.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No campuses found
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
                {editingCampus ? "Edit Campus" : "Add New Campus"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Campus Code *</label>
                  <input
                    type="text"
                    value={formData.campus_code}
                    onChange={(e) => setFormData({ ...formData, campus_code: e.target.value.toUpperCase() })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Campus Name *</label>
                  <input
                    type="text"
                    value={formData.campus_name}
                    onChange={(e) => setFormData({ ...formData, campus_name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
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
                  {editingCampus ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}