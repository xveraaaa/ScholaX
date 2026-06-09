import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
      document.title = "Privacy Policy";
    },[])
  return (
    <>
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-700">
          ScholaX respects your privacy and is committed
          to protecting your personal information.
        </p>

      </section>

      <Footer />
    </>
  );
}