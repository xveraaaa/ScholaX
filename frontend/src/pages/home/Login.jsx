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
      if (role === "TEACHER") navigate("/teacher/dashboard");
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
        style={{ backgroundImage: `url(${icct})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/60 to-slate-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_40%)]" />

        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
              <div className="hidden lg:block text-white space-y-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-200 border border-blue-400/20">
                  Student Information System
                </span>

                <div>
                  <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                    ICCT Colleges
                  </h1>
                  <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                    Sign in to view schedules, grades, announcements, and campus services.
                  </p>
                </div>

                <div className="grid gap-4">
                  
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                  <div className="text-center mb-8">
                    <div className="inline-flex rounded-full bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-200 mb-4">
                      Welcome back
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">ICCT</h1>
                    <p className="text-slate-400">Sign in to continue to your dashboard.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block text-sm text-slate-300">
                      Student Number / Admin
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
                        className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/95 px-4 py-4 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="Enter your username"
                      />
                    </label>

                    <label className="block text-sm text-slate-300">
                      Password
                      <div className="relative mt-3">
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
                          className="w-full rounded-3xl border border-slate-700 bg-slate-900/95 px-4 py-4 pr-12 text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                        Remember me
                      </label>
                      <Link to="/forgot-password" className="text-blue-300 hover:text-white transition">
                        Forgot Password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </button>

                    <Link
                      to="/create-account"
                      className="inline-flex w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
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