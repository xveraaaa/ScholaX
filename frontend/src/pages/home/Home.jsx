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
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-6 min-h-screen flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to ScholaX
            </h1>

            <p className="text-lg md:text-2xl text-gray-200 mb-8">
              Empowering future innovators through quality education,
              technology, and academic excellence.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/programs"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Explore Programs
              </Link>

              <Link
                to="/admissions"
                className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
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
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-4xl font-bold text-blue-900">10,000+</h2>
              <p className="text-gray-600 mt-2">Students</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-900">20+</h2>
              <p className="text-gray-600 mt-2">Programs</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-900">8</h2>
              <p className="text-gray-600 mt-2">Campuses</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-900">95%</h2>
              <p className="text-gray-600 mt-2">Graduate Employability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Why Choose ICCT?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Quality Education
              </h3>

              <p className="text-gray-600">
                Industry-relevant programs designed for modern careers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Modern Facilities
              </h3>

              <p className="text-gray-600">
                Access to laboratories, libraries, and learning spaces.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Student Success
              </h3>

              <p className="text-gray-600">
                Support services that help students achieve their goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>

          <p className="text-lg mb-8">
            Join ICCT and take the next step toward your future.
          </p>

          <Link
            to="/admissions"
            className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold"
          >
            Apply Today
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}