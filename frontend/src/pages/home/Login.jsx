import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../services/api";

import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

import loginBg from "../../assets/login_bg.jpeg";
import bun from "../../assets/bun_06.png";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import toast from "react-hot-toast";

export default function Login() {
  useEffect(() => {
    document.title = "Login";
  }, []);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "ADMIN") navigate("/admin/dashboard");
      if (role === "FACULTY") navigate("/faculty/dashboard");
      if (role === "STUDENT") navigate("/student/dashboard");
    } catch (err) {
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Login Form */}
        <div className="relative flex items-center justify-center min-h-screen px-6">
          <form
            onSubmit={handleSubmit}
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              p-8
            "
          >
            <div className="text-center mb-8">
              <img src={bun} alt="ScholaX" className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-blue-900 mb-2">
                Welcome Back
              </h1>

              <p className="text-gray-600">Sign in to access your account</p>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-3
                    pr-12
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                    hover:text-blue-900
                  "
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="
                    text-sm
                    text-blue-900
                    hover:underline
                    font-medium
                  "
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-blue-900
                  text-white
                  py-3
                  rounded-lg
                  font-semibold
                  hover:bg-blue-800
                  transition
                "
              >
                {loading ? "Logging in..." : "Login" }
              </button>
              <p className="text-center text-sm text-gray-600 mt-6">
                Having trouble accessing your account?
                <Link
                  to="/contact"
                  className="ml-1 text-blue-900 font-medium hover:underline"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
