import { useEffect, useState } from "react";
import PublicLayout from "../../layouts/HomeLayout";

import { useNavigate } from "react-router-dom";

export default function FAQ() {
  useEffect(() => {
    document.title = "Frequently Asked Questions";
    window.scrollTo(0, 0);
  }, []);


  const navigate = useNavigate();
  const faqs = [
    {
      question: "How do I apply for admission?",
      answer:
        "Visit the Admissions page and complete the online application form together with the required documents.",
    },
    {
      question: "What programs are offered?",
      answer:
        "We offer various undergraduate programs including Information Technology, Computer Science, Business Administration, and other academic disciplines.",
    },
    {
      question: "How can I check my grades?",
      answer:
        "Students can access their grades through the Student Portal after logging into their account.",
    },
    {
      question: "How do I contact the registrar?",
      answer:
        "You may contact the registrar through the Contact Us page or visit the campus administration office.",
    },
    {
      question: "Can I apply for scholarships?",
      answer:
        "Yes. Qualified students may apply for academic and financial assistance programs offered by the institution.",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
            Knowledge Base
          </span>

          <h1
            className="text-5xl md:text-7xl font-black"
            style={{
              textShadow:
                "0 0 15px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.3)",
            }}
          >
            Frequently Asked Questions
          </h1>

          <p className="mt-6 text-xl text-slate-200 max-w-3xl mx-auto">
            Find answers to common questions about admissions,
            enrollment, tuition, academics, and student services.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition-all
                p-6
                group
                border
                border-transparent
                hover:border-blue-100
              "
            >
              <summary
                className="
                  cursor-pointer
                  font-semibold
                  text-lg
                  text-blue-900
                  list-none
                  flex
                  justify-between
                  items-center
                  hover:text-blue-700
                  transition-colors
                "
              >
                <span className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold text-xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {faq.question}
                </span>

                <span className="
                  text-2xl 
                  transition-all 
                  duration-300 
                  group-open:rotate-45 
                  group-open:text-blue-600
                  text-gray-400
                  hover:text-blue-600
                ">
                  +
                </span>
              </summary>

              <div className="mt-4 pl-12 border-l-4 border-blue-200 pl-4">
                <p className="text-gray-600 leading-7">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <button
           onClick={() => navigate("/contact")}
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
              Contact Us
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}