import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

export default function Terms() {
  return (
    <>
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold mb-6">
          Terms & Conditions
        </h1>

        <p className="text-gray-700">
          By accessing ScholaX services, users agree
          to comply with all institutional policies.
        </p>

      </section>

      <Footer />
    </>
  );
}