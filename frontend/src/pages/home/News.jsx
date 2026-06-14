import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";
import api from "../../services/api"

export default function News() {
  // const [news, setNews] = useState([]);
  useEffect(() => {
    document.title = "News & Announcements";
    window.scrollTo(0, 0);
    api.get("/news").then((res) => {
    setNews(res.data);
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
      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            News & Announcements
          </h1>

          <p className="text-xl max-w-5xl text-center">
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