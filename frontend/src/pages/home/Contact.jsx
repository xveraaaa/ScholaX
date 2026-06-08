import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";

export default function Contact() {
    useEffect(() => {
    document.title = "Contact";
  },[])
  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Contact Us
        </h1>

        <p className="text-gray-600 mb-10">
          We'd love to hear from you. Reach out to us through the
          following contact information.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              School Information
            </h2>

            <div className="space-y-3">

              <p>
                📍 Address:
                <br />
                ICCT,
                Antipolo Campus,
                Antipolo City, Philippines
              </p>

              <p>
                📞 Phone:
                <br />
                +63 912 345 6789
              </p>

              <p>
                📧 Email:
                <br />
                info@icct.edu.ph
              </p>

            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Send a Message
            </h2>

            <form className="space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-3 rounded"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border p-3 rounded"
              ></textarea>

              <button
                className="bg-blue-900 text-white px-6 py-3 rounded"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 pb-16">

        <h2 className="text-3xl font-bold mb-4">
          Find Us
        </h2>

        <iframe
          title="School Location"
          // src="https://www.google.com/maps?q=Manila&output=embed"
          src="https://www.google.com/maps?q=ICCTAntipolo&output=embed"
          className="w-full h-96 rounded-xl shadow"
        ></iframe>

      </section>
      <Footer />
    </>
  );
}