import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../services/api";

import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

import icct from "../../assets/home/icct.jpeg";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import toast from "react-hot-toast";

export default function Login() {
  useEffect(() => {
    document.title = "Login";
  }, []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

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
          backgroundImage: `url(${icct})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side */}
              <div className="hidden lg:block text-white">
                <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 border border-blue-400/20 text-blue-200 mb-6">
                  Student Information System
                </span>

                <h1 className="text-6xl font-extrabold leading-tight mb-6">
                  Welcome to
                  <span className="block text-blue-400">
                    ScholaX
                  </span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                  Access your academic records, schedules,
                  grades, announcements, and campus services
                  through the ScholaX portal.
                </p>

                <div className="flex gap-8 mt-10">
                  <div>
                    <h3 className="text-4xl font-bold text-white">
                      10K+
                    </h3>
                    <p className="text-gray-400">
                      Students
                    </p>
                  </div>

                  <div>
                    <h3 className="text-4xl font-bold text-white">
                      20+
                    </h3>
                    <p className="text-gray-400">
                      Programs
                    </p>
                  </div>

                  <div>
                    <h3 className="text-4xl font-bold text-white">
                      95%
                    </h3>
                    <p className="text-gray-400">
                      Employability
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Card */}
              <div className="flex justify-center lg:justify-end">
                <div
                  className="
                    w-full
                    max-w-md
                    bg-white/10
                    backdrop-blur-2xl
                    border
                    border-white/20
                    rounded-3xl
                    shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                    p-8
                  "
                >
                  <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white">
                      ScholaX
                    </h1>

                    <p className="text-blue-100 mt-3">
                      Sign in to continue
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                      <label className="block text-white font-medium mb-2">
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
                        className="
                          w-full
                          h-14
                          rounded-xl
                          bg-white/90
                          px-4
                          outline-none
                          focus:ring-4
                          focus:ring-blue-400/30
                        "
                      />
                    </div>

                    <div className="mb-5">
                      <label className="block text-white font-medium mb-2">
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
                          className="
                            w-full
                            h-14
                            rounded-xl
                            bg-white/90
                            px-4
                            outline-none
                            focus:ring-4
                            focus:ring-blue-400/30
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-gray-500
                          "
                        >
                          {showPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-6">
                      <label className="flex items-center gap-2 text-white">
                        <input type="checkbox" />
                        Remember me
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-blue-300 hover:text-blue-200"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        w-full
                        h-14
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-semibold
                        transition-all
                        duration-300
                      "
                    >
                      {loading
                        ? "Signing In..."
                        : "Sign In"}
                    </button>

                    <Link
                      to="/create-account"
                      className="
                        mt-4
                        flex
                        items-center
                        justify-center
                        w-full
                        h-14
                        rounded-xl
                        border
                        border-white/20
                        bg-white/10
                        hover:bg-white/20
                        text-white
                        font-semibold
                        transition-all
                        duration-300
                      "
                    >
                      Create Account
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}