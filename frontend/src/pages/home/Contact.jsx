import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us";
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Contact Us
          </h1>

          <p className="text-xl max-w-5xl text-center">
            We'd love to hear from you. Reach out to us for inquiries,
            admissions assistance, and student services.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              School Information
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  📍 Address
                </h3>

                <p>
                  ICCT Antipolo Campus
                  <br />
                  Antipolo City, Philippines
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  📞 Phone
                </h3>

                <p>+63 912 345 6789</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  📧 Email
                </h3>

                <p>info@icct.edu.ph</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              Send a Message
            </h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="email"
                placeholder="Email Address"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <textarea
                rows="6"
                placeholder="Your Message"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <button
                type="submit"
                className="
                  bg-blue-900
                  text-white
                  px-8
                  py-3
                  rounded-lg
                  font-semibold
                  hover:bg-blue-800
                  transition
                "
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold text-blue-900 mb-8">
          Find Us
        </h2>

        <div className="overflow-hidden rounded-2xl shadow-md">
          <iframe
            title="School Location"
            src="https://www.google.com/maps?q=ICCTAntipolo&output=embed"
            className="w-full h-[500px]"
          />
        </div>
      </section>
    </PublicLayout>
  );
}