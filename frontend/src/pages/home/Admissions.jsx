import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

export default function Admissions() {
  return (
    <>
      <Navbar />

      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold mb-4">
            Admissions
          </h1>

          <p className="text-xl">
            Start your journey at ICCT today.
          </p>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold mb-6">
          Admission Requirements
        </h2>

        <div className="bg-white shadow rounded-xl p-6">

          <ul className="list-disc ml-6 space-y-2">
            <li>High School Report Card</li>
            <li>Birth Certificate</li>
            <li>Certificate of Good Moral Character</li>
            <li>2x2 ID Pictures</li>
            <li>Completed Application Form</li>
          </ul>

        </div>

      </section>

      <section className="bg-gray-100 py-16">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold mb-8">
            Enrollment Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">
                Step 1
              </h3>

              <p>Submit application requirements.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">
                Step 2
              </h3>

              <p>Application review and evaluation.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">
                Step 3
              </h3>

              <p>Pay enrollment fees.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">
                Step 4
              </h3>

              <p>Receive student credentials.</p>
            </div>

          </div>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Ready to Apply?
        </h2>

        <p className="mb-8 text-gray-600">
          Join thousands of students building their future at ICCT.
        </p>

        <button className="bg-blue-900 text-white px-8 py-3 rounded-lg">
          Apply Now
        </button>

      </section>

      <Footer />
    </>
  );
}