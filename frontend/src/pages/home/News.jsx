import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";

export default function News() {
    useEffect(() => {
        document.title = "News";
      },[])

  const news = [
    {
      title: "Enrollment for AY 2026-2027 is Now Open",
      date: "August 1, 2026",
      content:
        "Applications for the upcoming academic year are now being accepted."
    },
    {
      title: "Scholarship Program Available",
      date: "July 25, 2026",
      content:
        "Qualified students may apply for academic and financial scholarships."
    },
    {
      title: "New Computer Laboratory Opened",
      date: "July 10, 2026",
      content:
        "ICCT officially launches its state-of-the-art computer laboratory."
    }
  ];

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          News & Announcements
        </h1>

        <p className="text-gray-600 mb-10">
          Stay updated with the latest school events,
          announcements, and activities.
        </p>

        <div className="space-y-6">

          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-2xl font-bold">
                {item.title}
              </h2>

              <p className="text-gray-500 mt-1">
                {item.date}
              </p>

              <p className="mt-4 text-gray-700">
                {item.content}
              </p>
            </div>
          ))}

        </div>

      </section>
      <Footer />
    </>
  );
}