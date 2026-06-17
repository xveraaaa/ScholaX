import { useEffect } from "react";
import { Link } from "react-router-dom";

import PublicLayout from "../../layouts/HomeLayout";
import loginBg from "../../assets/login_bg.jpeg";

export default function Home() {
  useEffect(() => {
    document.title = "Home";
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/60 to-blue-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_70%)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 min-h-screen flex items-center">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 text-white text-sm font-semibold">
              Welcome to ICCT Colleges
            </span>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6"
              style={{
                textShadow:
                  "0 0 15px rgba(255,255,255,.3), 0 0 30px rgba(255,255,255,.1)",
              }}
            >
              Building Future Leaders
            </h1>

            <p className="text-lg md:text-2xl text-slate-200 mb-8">
              Empowering future innovators through quality education,
              technology, and academic excellence across Rizal Province.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/programs"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/30"
              >
                Explore Programs
              </Link>

              <Link
                to="/admissions"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 hover:scale-105 transition-all duration-300"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-900 text-sm font-semibold mb-4">
              ICCT by the Numbers
            </span>
            <h2 className="text-4xl font-bold text-blue-900">
              Our Impact in Numbers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-105">
              <h2 className="text-5xl font-black text-blue-900 mb-2">10,000+</h2>
              <p className="text-gray-600 font-semibold">Students</p>
              <p className="text-sm text-gray-400 mt-2">Thriving academic community</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-105">
              <h2 className="text-5xl font-black text-blue-900 mb-2">20+</h2>
              <p className="text-gray-600 font-semibold">Programs</p>
              <p className="text-sm text-gray-400 mt-2">Diverse course offerings</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-105">
              <h2 className="text-5xl font-black text-blue-900 mb-2">8</h2>
              <p className="text-gray-600 font-semibold">Campuses</p>
              <p className="text-sm text-gray-400 mt-2">Across Rizal Province</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            
            <h2 className="text-4xl font-bold text-blue-900">
              Why Choose ICCT?
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Discover what makes ICCT the premier choice for higher education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-blue-900 mb-4 group-hover:text-blue-700 transition">
                Quality Education
              </h3>
              <p className="text-gray-600 leading-7">
                Industry-relevant programs designed for modern careers with CHED, TESDA, and DepEd recognition.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold text-blue-900 mb-4 group-hover:text-blue-700 transition">
                Modern Facilities
              </h3>
              <p className="text-gray-600 leading-7">
                Access to state-of-the-art laboratories, libraries, and modern learning spaces.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-blue-900 mb-4 group-hover:text-blue-700 transition">
                Student Success
              </h3>
              <p className="text-gray-600 leading-7">
                Comprehensive support services that help students achieve their academic and career goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            Join Us
          </span>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4"
            style={{
              textShadow:
                "0 0 15px rgba(255,255,255,.3), 0 0 30px rgba(255,255,255,.1)",
            }}
          >
            Ready to Begin Your Journey?
          </h2>

          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have chosen ICCT for their academic excellence and career success.
          </p>

          <Link
            to="/admissions"
            className="inline-block bg-white text-blue-900 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/30"
          >
            Apply Today
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}