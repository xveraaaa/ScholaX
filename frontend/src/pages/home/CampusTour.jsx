import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

import bun from "../../assets/bun_06.png";

export default function CampusTour() {
  useEffect(() => {
    document.title = "Campus Tour";
  }, []);

  const places = [
    {
      title: "Main Library",
      image: bun,
    },
    {
      title: "Computer Laboratory",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
      title: "Student Center",
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585",
    },
    {
      title: "Auditorium",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865",
    },
    {
      title: "Gymnasium",
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
    },
    {
      title: "Campus Grounds",
      image:
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Campus Tour
          </h1>

          <p className="text-xl max-w-3xl mx-auto">
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