import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

export default function Programs() {
  useEffect(() => {
    document.title = "Programs";
  }, []);

  const programs = [
    {
      title: "BS Information Technology",
      description:
        "Focuses on software development, networking, cybersecurity, and database systems.",
    },
    {
      title: "BS Computer Science",
      description:
        "Covers algorithms, artificial intelligence, software engineering, and computing theory.",
    },
    {
      title: "BS Business Administration",
      description:
        "Develops leadership, management, entrepreneurship, and business skills.",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Academic Programs
          </h1>

          <p className="text-xl max-w-3xl mx-auto">
            Explore our degree programs designed to prepare students
            for successful careers and lifelong learning.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <div
              key={index}
              className="
                bg-white
                p-8
                rounded-2xl
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                {program.title}
              </h2>

              <p className="text-gray-600 leading-7">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}