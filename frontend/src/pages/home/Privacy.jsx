import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy";
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Privacy Policy
          </h1>

          <p className="text-xl max-w-5xl text-center">
            ScholaX respects your privacy and is committed to
            protecting your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-lg p-10 md:p-14">
            <h2 className="text-2xl font-bold mb-4">
              Information We Collect
            </h2>

            <p className="text-gray-600 leading-relaxed mb-8">
              We collect information that you voluntarily provide
              when applying for admission, contacting us, or using
              our services.
            </p>

            <h2 className="text-2xl font-bold mb-4">
              How We Use Information
            </h2>

            <p className="text-gray-600 leading-relaxed mb-8">
              Your information is used to process applications,
              provide student services, improve our platform, and
              communicate important updates.
            </p>

            <h2 className="text-2xl font-bold mb-4">
              Data Protection
            </h2>

            <p className="text-gray-600 leading-relaxed">
              We implement appropriate security measures to protect
              your personal data against unauthorized access,
              disclosure, alteration, or destruction.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}