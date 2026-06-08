import Navbar from "../../components/home/Navbar"
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
      document.title = "About";
    },[])
  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          About ScholaX
        </h1>

        <p className="text-lg text-gray-700 leading-8 mb-6">
          ScholaX is a modern educational institution
          dedicated to providing quality education,
          innovation, and leadership opportunities for
          students.
        </p>

        <p className="text-lg text-gray-700 leading-8">
          Our mission is to empower learners through
          technology-driven education while fostering
          academic excellence, integrity, and social
          responsibility.
        </p>

      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-100 py-16">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Mission
            </h2>

            <p className="text-gray-700">
              To provide accessible and innovative
              education that prepares students for
              lifelong success.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Vision
            </h2>

            <p className="text-gray-700">
              To become a leading institution recognized
              for excellence in education, research,
              and community engagement.
            </p>
          </div>

        </div>

      </section>
    </>
  );
}