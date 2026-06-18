import { Link } from "react-router-dom";
import { 
  FaTwitter, 
  FaFacebook, 
  FaInstagram,
  FaYoutube,
  FaLinkedin
} from "react-icons/fa";

import ilogo from "../../assets/home/ilogo.jpeg";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          <div className="md:w-1/3">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black overflow-hidden">
                <img 
                  src={ilogo} 
                  alt="ICCT Colleges Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">ICCT Colleges</h2>
                <p className="text-gray-300 text-sm">Empowering students through quality education, innovation, and technology.</p>
              </div>
            </Link>

            <div className="mt-6 flex items-center gap-3 text-gray-400">
              <a 
                href="https://twitter.com/icctcolleges" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a 
                href="https://facebook.com/icctcolleges" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a 
                href="https://instagram.com/icctcolleges" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a 
                href="https://youtube.com/icctcolleges" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <FaYoutube className="text-lg" />
              </a>
              <a 
                href="https://linkedin.com/school/icctcolleges" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300"
              >
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Rest of your footer content remains the same */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
            <div>
              <h3 className="font-semibold mb-3 text-gray-100">Quick Links</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/programs" className="hover:text-white transition">Programs</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-gray-100">Legal</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-gray-100">Contact</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>📍 Antipolo City, Philippines</p>
                <p>📞 +63 912 345 6789</p>
                <p>📧 info@icct.edu.ph</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-gray-400 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© {year} V. All rights reserved.</p>
          <p className="text-sm">Made with ❤️ </p>
        </div>
      </div>
    </footer>
  );
}