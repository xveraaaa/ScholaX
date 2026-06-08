import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-blue-900">ScholaX</h1>
        </div>

        {/* Navigation */}
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>

          <Link to="/programs" className="hover:text-blue-600">
            Programs
          </Link>

          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>

          <Link to="/faq" className="hover:text-blue-600">
            FAQ
          </Link>

          <Link to="/campus-tour">Campus Tour</Link>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
