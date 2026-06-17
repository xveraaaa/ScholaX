import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

import { useNavigate } from "react-router-dom";

import bun1 from "../../assets/home/bun_00.png";
import bun2 from "../../assets/home/bun_01.png";
import bun3 from "../../assets/home/bun_02.png";
import bun4 from "../../assets/home/bun_03.png";
import bun5 from "../../assets/home/bun_05.png";
import bun6 from "../../assets/home/bun_06.png";

export default function CampusTour() {
  useEffect(() => {
    document.title = "Campus Tour";
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const places = [
    {
      title: "Main Library",
      image: bun1,
    },
    {
      title: "Computer Laboratory",
      image:
        bun2,
    },
    {
      title: "Student Center",
      image:
        bun3,
    },
    {
      title: "Auditorium",
      image:
        bun4,
    },
    {
      title: "Gymnasium",
      image:
        bun5,
    },
    {
      title: "Campus Grounds",
      image:
        bun6,
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
            Virtual Campus Tour
          </span>

          <h1
            className="text-5xl md:text-7xl font-black"
            style={{
              textShadow:
                "0 0 15px rgba(255,255,255,.8), 0 0 35px rgba(255,255,255,.4)",
            }}
          >
            Explore Our Campus
          </h1>

          <p className="mt-6 text-xl text-slate-200 max-w-3xl mx-auto">
            Discover modern facilities, learning spaces, and student
            environments designed for success.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place, index) => (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                shadow-lg
                h-80
                animate-[fadeUp_.6s_ease-out]
              "
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <img
                src={place.image}
                alt={place.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-110
                "
              />


              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/80
                  via-black/20
                  to-transparent
                "
              />

              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {place.title}
                </h2>

                <p className="text-white/80 mt-1">
                  Click to explore
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-black mb-4">
            Ready to Experience ICCT?
          </h2>

          <p className="text-slate-300 text-lg mb-8">
            Visit one of our campuses and discover the opportunities waiting for you.
          </p>

          <button
           onClick={() => navigate("/contact")}
            className="
              inline-block
              bg-blue-900
              text-white
              px-8
              py-3
              rounded-lg
              font-semibold
              hover:bg-blue-800
              hover:scale-105
              transition-all
              duration-300
              shadow-lg
              hover:shadow-blue-500/30
            "
            >
            Schedule a Visit
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}