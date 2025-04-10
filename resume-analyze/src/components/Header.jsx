import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full bg-black text-white font-bold text-lg py-3 px-6">
      <div className="max-w-500 mx-auto flex items-center justify-between p-4">
        <div className="text-xl">ResumeAI</div>

        {/* mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/signup" className="hover:underline">Sign Up</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </nav>
      </div>

      {/* Menu dropdown mobile */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-black text-white rounded-xl shadow-lg z-50 w-48 p-4 animate-fade-in">

          <div className="flex flex-col gap-4 text-lg text-center">
          <h2 className="text-xl font-bold text-center">Menu</h2>
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:underline">Home</Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="hover:underline">Sign Up</Link>
            <Link to="/login" onClick={() => setIsOpen(false)} className="hover:underline">Login</Link>
          </div>
        </div>
      )}
    </header>
  );
}
