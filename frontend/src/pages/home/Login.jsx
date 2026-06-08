import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await api.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      const role = res.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      }

      if (role === "FACULTY") {
        navigate("/faculty/dashboard");
      }

      if (role === "STUDENT") {
        navigate("/student/dashboard");
      }

    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        >

          <h1 className="text-3xl font-bold text-center mb-6">
            Login
          </h1>

          <input
            type="text"
            placeholder="Username"
            className="w-full border p-3 rounded mb-4"
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded mb-4"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded"
          >
            Login
          </button>

        </form>

      </div>

      <Footer />
    </>
  );
}