import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold mb-4">
            ScholaX
          </h2>

          <p className="text-gray-300">
            Empowering students through quality
            education and innovation.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Legal
          </h3>

          <ul className="space-y-2">
            <li>
              <Link to="/privacy">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/terms">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Contact
          </h3>

          <p>📍 Antipolo Campus</p>
          <p>📞 +63 912 345 6789</p>
          <p>📧 info@icct.edu.ph</p>
        </div>

      </div>

      <div className="border-t border-slate-700 py-4 text-center text-gray-400">
        © 2026 V. All Rights Reserved.
      </div>

    </footer>
  );
}