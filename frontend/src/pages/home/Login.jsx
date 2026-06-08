import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      username: "",
      password: ""
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res =
        await api.post(
          "/auth/login",
          form
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      const role =
        res.data.user.role;

      if (role === "ADMIN") {
        navigate(
          "/admin/dashboard"
        );
      }

      if (role === "FACULTY") {
        navigate(
          "/faculty/dashboard"
        );
      }

      if (role === "STUDENT") {
        navigate(
          "/student/dashboard"
        );
      }

    } catch (error) {
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          ScholaX
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              username:
                e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value
            })
          }
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Login
        </button>

      </form>

    </div>
  );
}