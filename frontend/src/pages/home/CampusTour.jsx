import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

import bun1 from "../../assets/home/bun_00.png";
import bun2 from "../../assets/home/bun_01.png";
import bun3 from "../../assets/home/bun_02.png";
import bun4 from "../../assets/home/bun_03.png";
import bun5 from "../../assets/home/bun_05.png";
import bun6 from "../../assets/home/bun_06.png";

export default function CampusTour() {
  useEffect(() => {
    document.title = "Campus Tour";
  }, []);

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
      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Campus Tour
          </h1>

          <p className="text-xl max-w-5xl text-center">
            Explore our facilities and discover what makes ICCT
            an excellent place to learn, grow, and succeed.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place, index) => (
            <div
              key={index}
              className="
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={place.image}
                  alt={place.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    hover:scale-110
                    transition-transform
                    duration-500
                  "
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-blue-900">
                  {place.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}