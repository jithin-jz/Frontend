import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12 border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 text-center">

        <h2 className="text-lg font-semibold mb-4 text-white">
          THE SOULED STORE
        </h2>

        <div className="flex justify-center gap-6 text-sm mb-5">
          <Link to="/about" className="hover:text-white">
            About
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-white">
            Privacy
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} The Souled Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
