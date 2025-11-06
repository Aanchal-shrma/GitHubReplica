import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#0d1117] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      {/* Left: GitHub Logo + Branding */}
      <Link to="/" className="flex items-center gap-3 hover:opacity-80">
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Logo"
          className="w-8 h-8 rounded-full"
        />
        <h3 className="text-white font-semibold text-lg">GitHub</h3>
      </Link>

      {/* Right: Menu Links */}
      <div className="flex items-center gap-6">
        <Link
          to="/create"
          className="text-gray-300 hover:text-white font-medium transition"
        >
          Create Repository
        </Link>
        <Link
          to="/profile"
          className="text-gray-300 hover:text-white font-medium transition"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
