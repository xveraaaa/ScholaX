import { useEffect } from "react";
import PublicLayout from "../../layouts/HomeLayout";

export default function About() {
  useEffect(() => {
    document.title = "About";
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            About ICCT
          </h1>

          <p className="text-xl max-w-5xl text-center">
            Providing quality education and preparing students for
            success through innovation, technology, and academic
            excellence.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-8 text-lg text-gray-700 leading-8">
          <p>
            ICCT Colleges is a tertiary education provider with campuses
            located throughout the Province of Rizal, Philippines. Its
            campuses are located in Cainta, Sumulong (Cainta), San Mateo,
            Cogeo, Antipolo, Taytay, Binangonan, and Angono.
          </p>

          <p>
            Course offerings include Arts & Sciences, Business,
            Computer Studies, Criminology, Education, Engineering,
            Health Sciences, Hospitality & Tourism Management,
            Short-Term Certificate Programs, and Senior High School.
          </p>

          <p>
            ICCT Colleges operates under the laws of the Republic of the
            Philippines and offers programs recognized by CHED, TESDA,
            DepEd, and various industry certification bodies.
          </p>

          <p>
            We pride ourselves on producing graduates who are equipped
            with technical expertise, critical thinking skills, and the
            values necessary to succeed in a rapidly changing global
            environment.
          </p>

          <p>
            We invite you to become part of our growing academic
            community as a student, employee, or partner.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                Mission
              </h2>

              <p className="text-gray-700 leading-8">
                To prepare students for the manifold demands of
                technological efficiency needed in the fields of
                Information & Communication Technology, Health Sciences,
                and various educational disciplines through research,
                advanced studies, and international linkages while
                fostering genuine love for work and value-based
                leadership.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                Vision
              </h2>

              <p className="text-gray-700 leading-8 text-lg">
                To become the leading premier provider of higher
                education in Asia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}