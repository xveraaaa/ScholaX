import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Admissions() {
  const year = new Date().getFullYear();
  useEffect(() => {
    document.title = "Admissions";
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const requirements = [
    "High School Report Card",
    "Birth Certificate",
    "Certificate of Good Moral Character",
    "2x2 ID Pictures",
    "Completed Application Form",
  ];

  const steps = [
    {
      title: "Submit Requirements",
      description:
        "Provide all required documents for application processing.",
    },
    {
      title: "Application Review",
      description:
        "Our admissions team evaluates your submitted requirements.",
    },
    {
      title: "Pay Enrollment Fees",
      description:
        "Complete the necessary enrollment and registration payments.",
    },
    {
      title: "Receive Credentials",
      description:
        "Get your student credentials and officially begin your journey.",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
            Admissions {year}
          </span>

          <h1
            className="text-5xl md:text-7xl font-black"
            style={{
              textShadow:
                "0 0 15px rgba(255,255,255,.8), 0 0 35px rgba(255,255,255,.4)",
            }}
          >
            Start Your Journey
          </h1>

          <p className="mt-6 text-xl text-slate-200 max-w-3xl mx-auto">
            Become part of a community dedicated to academic excellence,
            innovation, and career success.
          </p>
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-blue-900 mb-8">
          Admission Requirements
        </h2>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <ul className="space-y-4">
            {requirements.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-gray-700"
              >
                <span className="text-green-600 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Enrollment Process */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">
            Enrollment Process
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="
                  bg-white
                  rounded-2xl
                  shadow-md
                  p-8
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                "
              >
                <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg mb-4">
                  {index + 1}
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-7">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Ready to Apply?
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            Join thousands of students building their future through
            quality education at ICCT.
          </p>


            
          <button
           onClick={() => navigate("/apply-now")}
            className="
              inline-block
              bg-blue-900
              text-white
              px-8
              py-3
              rounded-lg
              font-semibold
              hover:bg-blue-800
              hover:scale-105
              transition-all
              duration-300
              shadow-lg
              hover:shadow-blue-500/30
            "
            >
              Apply Now
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}