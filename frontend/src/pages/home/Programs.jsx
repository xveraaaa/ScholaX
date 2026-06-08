import Navbar from "../../components/home/Navbar";
import { useEffect } from "react";

export default function Programs() {
    useEffect(() => {
        document.title = "Programs";
      },[])
  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Academic Programs
        </h1>

        <p className="text-gray-600 mb-10">
          Explore our degree programs designed to prepare students
          for successful careers and lifelong learning.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">
              BS Information Technology
            </h2>

            <p className="text-gray-600">
              Focuses on software development, networking,
              cybersecurity, and database systems.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">
              BS Computer Science
            </h2>

            <p className="text-gray-600">
              Covers algorithms, artificial intelligence,
              software engineering, and computing theory.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">
              BS Business Administration
            </h2>

            <p className="text-gray-600">
              Develops leadership, management,
              entrepreneurship, and business skills.
            </p>
          </div>

        </div>

      </section>
    </>
  );
}