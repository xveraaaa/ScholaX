import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About";
  }, []);
  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-blue-900 mb-6">About ICCT</h1>

        <p className="text-lg text-gray-700 leading-8 mb-6">
          ICCT Colleges is a tertiary education provider with campuses located
          in the Province of Rizal, Philippines. In Rizal, it has campuses in
          the municipality of Cainta, Sumulong (Cainta), San Mateo, Cogeo,
          Antipolo, Taytay, Binangonan, and Angono. Course offerings include
          Arts & Sciences, Business, Computer, Criminology, Education,
          Engineering, Health Sciences, Hospitality & Tourism Management, Short
          Term/Certificate Programs, And SENIOR HIGH SCHOOL (Grade 11 & 12).
        </p>
        <p className="text-lg text-gray-700 leading-8 mb-6">
          ICCT Colleges exists under the law of the Republic of the Philippines
          and offers courses that are accredited by the Commission on Higher
          Education (CHED), Technical Education and Skills Development Authority
          (TESDA), Department of Education (DepEd), and as well as Industry
          Accredited Certificates.
        </p>
        <p className="text-lg text-gray-700 leading-8 mb-6">
          We pride ourselves not just in offering globally competitive programs
          but in also producing quality graduates ready for the global job
          market, who are equipped with creative thinking tools and technical
          competences.
        </p>
        <p className="text-lg text-gray-700 leading-8 mb-6">
          We invite you to join us as a student, employee, or partner and visit
          our campuses to take part in our endeavor.
        </p>

        {/* <p className="text-lg text-gray-700 leading-8 mb-6">
          ICCT is a modern educational institution
          dedicated to providing quality education,
          innovation, and leadership opportunities for
          students.
        </p>

        <p className="text-lg text-gray-700 leading-8">
          Our mission is to empower learners through
          technology-driven education while fostering
          academic excellence, integrity, and social
          responsibility.
        </p> */}
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Mission</h2>

            <p className="text-gray-700">
              To prepare students for the manifold demands of technological
              efficiency needed in the fields of Information & Communication
              Technology, the Health Sciences and the various disciplines of
              educational pursuits through research, advanced studies, and
              international linkages; and to temper this training with the
              inculcation of genuine love for work and the virtues of a
              value-based individual.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Vision</h2>

            <p className="text-gray-700">
              To become the leading premier provider of higher education in Asia.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
