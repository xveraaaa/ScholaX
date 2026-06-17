import { useEffect, useState } from "react";
import PublicLayout from "../../layouts/HomeLayout";

export default function Contact() {
  const [selectedCampus, setSelectedCampus] = useState("antipolo");
  const [mapCampus, setMapCampus] = useState("antipolo");

  useEffect(() => {
    document.title = "Contact Us";
    window.scrollTo(0, 0);
  }, []);

  const campuses = {
    antipolo: {
      name: "Antipolo Campus",
      address: "Antipolo City, Philippines",
      phone: "+63 912 345 6789",
      email: "antipolo@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTAntipolo&output=embed",
    },
    cainta: {
      name: "Cainta Campus",
      address: "Cainta, Rizal, Philippines",
      phone: "+63 912 345 6790",
      email: "cainta@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTCainta&output=embed",
    },
    "san-mateo": {
      name: "San Mateo Campus",
      address: "San Mateo, Rizal, Philippines",
      phone: "+63 912 345 6791",
      email: "sanmateo@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTSanMateo&output=embed",
    },
    cogeo: {
      name: "Cogeo Campus",
      address: "Cogeo, Antipolo, Philippines",
      phone: "+63 912 345 6792",
      email: "cogeo@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTCogeo&output=embed",
    },
    taytay: {
      name: "Taytay Campus",
      address: "Taytay, Rizal, Philippines",
      phone: "+63 912 345 6793",
      email: "taytay@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTTaytay&output=embed",
    },
    binangonan: {
      name: "Binangonan Campus",
      address: "Binangonan, Rizal, Philippines",
      phone: "+63 912 345 6794",
      email: "binangonan@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTBinangonan&output=embed",
    },
    angono: {
      name: "Angono Campus",
      address: "Angono, Rizal, Philippines",
      phone: "+63 912 345 6795",
      email: "angono@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTAngono&output=embed",
    },
    sumulong: {
      name: "Sumulong Campus",
      address: "Sumulong, Cainta, Philippines",
      phone: "+63 912 345 6796",
      email: "sumulong@icct.edu.ph",
      map: "https://www.google.com/maps?q=ICCTSumulong&output=embed",
    },
  };

  const currentCampus = campuses[selectedCampus];
  const currentMapCampus = campuses[mapCampus];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
            Get in Touch
          </span>

          <h1
            className="text-5xl md:text-7xl font-black"
            style={{
              textShadow:
                "0 0 15px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.3)",
            }}
          >
            Contact Us
          </h1>

          <p className="mt-6 text-xl text-slate-200 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out to us for inquiries,
            admissions assistance, and student services.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              School Information
            </h2>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  📍 Address
                </h3>

                <p>
                  {currentCampus.name}
                  <br />
                  {currentCampus.address}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  📞 Phone
                </h3>

                <p>{currentCampus.phone}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  📧 Email
                </h3>

                <p>{currentCampus.email}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              Send a Message
            </h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition
                "
              />

              <input
                type="email"
                placeholder="Email Address"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition
                "
              />

              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition
                  bg-white
                  cursor-pointer
                "
              >
                <option value="antipolo">🏫 Antipolo Campus</option>
                <option value="cainta">🏫 Cainta Campus</option>
                <option value="san-mateo">🏫 San Mateo Campus</option>
                <option value="cogeo">🏫 Cogeo Campus</option>
                <option value="taytay">🏫 Taytay Campus</option>
                <option value="binangonan">🏫 Binangonan Campus</option>
                <option value="angono">🏫 Angono Campus</option>
                <option value="sumulong">🏫 Sumulong Campus</option>
              </select>

              <textarea
                rows="6"
                placeholder="Your Message"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition
                "
              />

              <button
                type="submit"
                className="
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
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-900 text-sm font-semibold mb-4">
            Location
          </span>
          <h2 className="text-4xl font-bold text-blue-900">
            Find Us
          </h2>
          
          {/* Campus Selector for Map */}
          <div className="max-w-md mx-auto mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Campus to View Location
            </label>
            <select
              value={mapCampus}
              onChange={(e) => setMapCampus(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
                bg-white
                cursor-pointer
                shadow-sm
              "
            >
              <option value="antipolo">🗺️ Antipolo Campus</option>
              <option value="cainta">🗺️ Cainta Campus</option>
              <option value="san-mateo">🗺️ San Mateo Campus</option>
              <option value="cogeo">🗺️ Cogeo Campus</option>
              <option value="taytay">🗺️ Taytay Campus</option>
              <option value="binangonan">🗺️ Binangonan Campus</option>
              <option value="angono">🗺️ Angono Campus</option>
              <option value="sumulong">🗺️ Sumulong Campus</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Currently viewing: <span className="font-semibold text-blue-900">{currentMapCampus.name}</span>
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
          <iframe
            key={mapCampus}
            title={`${currentMapCampus.name} Location`}
            src={currentMapCampus.map}
            className="w-full h-[500px]"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>
    </PublicLayout>
  );
}