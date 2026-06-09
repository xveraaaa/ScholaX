import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

export default function Admissions() {
  useEffect(() => {
    document.title = "Admissions";
  }, []);

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
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Admissions
          </h1>

          <p className="text-xl max-w-3xl mx-auto">
            Start your academic journey with ICCT and become part of a
            community committed to excellence and innovation.
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
            className="
              bg-blue-900
              text-white
              px-8
              py-4
              rounded-lg
              font-semibold
              hover:bg-blue-800
              transition
            "
          >
            Apply Now
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}