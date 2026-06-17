import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";
import api from "../../services/api";

export default function News() {
  useEffect(() => {
    document.title = "News & Announcements";
    window.scrollTo(0, 0);
    api.get("/news").then((res) => {
      // setNews(res.data);
    });
  }, []);

  const news = [
    {
      title: "Enrollment for AY 2026-2027 is Now Open",
      date: "August 1, 2026",
      content:
        "Applications for the upcoming academic year are now being accepted.",
      category: "Admissions",
    },
    {
      title: "Scholarship Program Available",
      date: "July 25, 2026",
      content:
        "Qualified students may apply for academic and financial scholarships.",
      category: "Scholarship",
    },
    {
      title: "New Computer Laboratory Opened",
      date: "July 10, 2026",
      content:
        "ICCT officially launches its state-of-the-art computer laboratory.",
      category: "Campus",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1d4ed8] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
            Latest Updates
          </span>

          <h1
            className="text-5xl md:text-7xl font-black"
            style={{
              textShadow:
                "0 0 15px rgba(255,255,255,.7), 0 0 30px rgba(255,255,255,.3)",
            }}
          >
            News & Announcements
          </h1>

          <p className="mt-6 text-xl text-slate-200 max-w-3xl mx-auto">
            Stay informed about important announcements, events,
            academic updates, and campus activities.
          </p>
        </div>
      </section>

      {/* News List */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-8">
          {news.map((item, index) => (
            <article
              key={index}
              className="
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition-all
                p-8
              "
            >
              {/* Category Badge */}
              <span
                className="
                  inline-block
                  bg-blue-100
                  text-blue-900
                  text-sm
                  font-semibold
                  px-3
                  py-1
                  rounded-full
                  mb-4
                "
              >
                {item.category}
              </span>

              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                {item.title}
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                {item.date}
              </p>

              <p className="text-gray-700 leading-7">
                {item.content}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}