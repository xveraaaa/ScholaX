import Navbar from "../../components/home/Navbar";
import { useEffect } from "react";
import Footer from "../../components/home/Footer";

export default function CampusTour() {
    useEffect(() => {
        document.title = "Campus Tour";
      },[])
  const places = [
    {
      title: "Main Library",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da"
    },
    {
      title: "Computer Laboratory",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
      title: "Student Center",
      image: "https://images.unsplash.com/photo-1562774053-701939374585"
    },
    {
      title: "Auditorium",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865"
    },
    {
      title: "Gymnasium",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b"
    },
    {
      title: "Campus Grounds",
      image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d"
    }
  ];

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Campus Tour
        </h1>

        <p className="text-gray-600 mb-10">
          Explore our facilities and discover what makes
          ICCT an excellent place to learn and grow.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          {places.map((place, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow overflow-hidden"
            >

              <img
                src={place.image}
                alt={place.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold">
                  {place.title}
                </h2>
              </div>

            </div>
          ))}

        </div>

      </section>
      <Footer />
    </>
  );
}