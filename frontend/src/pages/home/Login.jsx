import { useEffect, useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";

import api from "../../services/api";

import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

import loginBg from "../../assets/login_bg.jpeg";
import bun from "../../assets/bun_06.png";
import icct from "../../assets/home/icct.jpeg"

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
      <div
        className="min-h-screen flex justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${icct})`,
        }}
      >
        <div className="w-[450px] max-w-[95%] bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white tracking-widest">
              ScholaX
            </h1>

            <h2 className="text-2xl font-semibold text-white mt-2">
              LOGIN PAGE
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-white font-bold mb-2">
                Student Number / Admin
              </label>

              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                required
                className="w-full h-14 rounded-xl px-4 text-black outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block text-white font-bold mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                  className="w-full h-14 rounded-xl px-4 text-black outline-none"
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
            </div>

            <div className="flex justify-between items-center text-white mb-5">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

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
              className="w-full h-14 rounded-xl bg-blue-700 hover:bg-blue-900 duration-300 text-white font-bold text-lg"
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>
          <button className="w-full h-14 rounded-xl bg-gray-700 hover:bg-gray-900 duration-300 text-white font-bold text-lg mt-4">
              <Link
                to="/create-account"
              >
                CREATE ACCOUNT
              </Link>
            </button>
        </div>
      </div>
      <Footer />
    </>
  );
}


