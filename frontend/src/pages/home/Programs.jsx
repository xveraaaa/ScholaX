import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

export default function Programs() {
  useEffect(() => {
    document.title = "Programs";
    window.scrollTo(0, 0);
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
    
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}

      
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] relative overflow-hidden text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1
            className="
              text-6xl md:text-7xl font-black text-white
              animate-[fadeUp_1s_ease-out]
            "
            style={{
              textShadow:
                "0 0 15px rgba(255,255,255,.8), 0 0 35px rgba(255,255,255,.4)",
            }}
          >
            Academic Programs
          </h1>

          <p className="mt-4 text-xl text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            Explore our degree programs designed to prepare students for
            successful careers and lifelong learning.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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