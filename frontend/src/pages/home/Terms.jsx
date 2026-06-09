import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
      document.title = "Terms & Conditions";
    },[])
  return (
    <>
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16 min-h-[calc(100vh-300px)]">
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