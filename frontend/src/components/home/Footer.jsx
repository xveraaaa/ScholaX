import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              ScholaX
            </h2>

            <p className="text-gray-300 leading-7">
              Empowering students through quality
              education, innovation, and technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/programs"
                  className="hover:text-white transition"
                >
                  Programs
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">
              Legal
            </h3>

            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">
              Contact
            </h3>

            <div className="space-y-2 text-gray-300">
              <p>📍 Antipolo City, Philippines</p>
              <p>📞 +63 912 345 6789</p>
              <p>📧 info@icct.edu.ph</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-gray-400">
          © {year} V. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}