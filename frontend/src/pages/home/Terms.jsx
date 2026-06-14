import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
      document.title = "Terms & Conditions";
      window.scrollTo(0, 0);
    },[])
  return (
    <>
      <Navbar />

<section className="pt-32 pb-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
  <div className="max-w-5xl mx-auto px-6 text-center">
    <h1 className="text-5xl md:text-6xl font-bold mb-4">
      Terms & Conditions
    </h1>

    <p className="text-xl text-blue-100">
      By accessing ScholaX services, users agree to comply
      with all institutional policies.
    </p>
  </div>
</section>

{/* Content */}
<section className="py-20 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <div className="bg-white rounded-3xl shadow-lg p-10 md:p-14">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">
            Acceptance of Terms
          </h2>
          <p className="text-gray-600 leading-8">
            By using ScholaX services, you agree to comply with
            all institutional rules, regulations, and policies.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">
            User Responsibilities
          </h2>
          <p className="text-gray-600 leading-8">
            Users must provide accurate information and use
            the platform only for lawful educational purposes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">
            Privacy
          </h2>
          <p className="text-gray-600 leading-8">
            Personal information is handled according to our
            Privacy Policy and applicable data protection laws.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">
            Changes to Terms
          </h2>
          <p className="text-gray-600 leading-8">
            ScholaX reserves the right to update these terms
            at any time without prior notice.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<Footer />
    </>
  );
}