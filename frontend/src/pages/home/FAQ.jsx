import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

export default function FAQ() {
  useEffect(() => {
    document.title = "Frequently Asked Questions";
  }, []);

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
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Frequently Asked Questions
          </h1>

          <p className="text-xl max-w-3xl mx-auto">
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
                p-6
                group
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
                "
              >
                {faq.question}

                <span className="text-2xl transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 text-gray-600 leading-7">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}