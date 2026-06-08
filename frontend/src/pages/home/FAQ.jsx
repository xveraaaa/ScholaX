import Navbar from "../../components/home/Navbar";
import { useEffect } from "react";

export default function FAQ() {
    useEffect(() => {
        document.title = "Frequently Asked Questions";
      },[])
  return (
    <>
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Frequently Asked Questions
        </h1>

        <p className="text-gray-600 mb-10">
          Find answers to common questions about admissions,
          enrollment, tuition, and student services.
        </p>

        <div className="space-y-6">

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="font-bold text-lg">
              How do I apply for admission?
            </h2>

            <p className="mt-2 text-gray-600">
              Visit the Admissions page and complete the online
              application form along with the required documents.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="font-bold text-lg">
              What programs are offered?
            </h2>

            <p className="mt-2 text-gray-600">
              We offer various undergraduate programs including
              Information Technology, Computer Science, and Business Administration.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="font-bold text-lg">
              How can I check my grades?
            </h2>

            <p className="mt-2 text-gray-600">
              Students can access their grades through the Student Portal
              after logging in.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="font-bold text-lg">
              How do I contact the registrar?
            </h2>

            <p className="mt-2 text-gray-600">
              You may contact the registrar through our Contact Us page
              or visit the campus administration office.
            </p>
          </div>

        </div>

      </section>
    </>
  );
}