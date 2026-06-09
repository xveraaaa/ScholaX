import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import loginBg from "../../assets/login_bg.jpeg";

export default function Home() {
  useEffect(() => {
    document.title = "Home";
  },[])

  return (
    <>
      <Navbar />

      <section className="bg-blue-900 text-white min-h-[80vh] flex items-center min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{
                backgroundImage: `url(${loginBg})`,
              }}
      >

        <div className="max-w-7xl mx-auto px-6">

          <h1 className="text-6xl font-bold mb-4">
            Welcome to ScholaX
          </h1>

          <p className="text-xl mb-8">
            Empowering future innovators through
            quality education and technology.
          </p>
          
          <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold">
            <Link to="/programs">
            Explore Programs
            </Link>
          </button>

        </div>

      </section>
      <Footer />
    </>
  );
}