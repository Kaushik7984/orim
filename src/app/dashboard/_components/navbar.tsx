"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full p-4 border-b ${
        scrolled ? "bg-white/70 backdrop-blur shadow-sm" : "bg-white"
      }`}
    >
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='text-lg font-bold'>Miro Clone</div>
        <div>
          <button className='text-sm px-4 py-2 bg-black text-white rounded-md'>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
