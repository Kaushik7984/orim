"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ProductPreview() {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => {
      if (previewRef.current) {
        observer.unobserve(previewRef.current);
      }
    };
  }, []);

  return (
    <section className='py-16 px-4 relative'>
      <div className='container mx-auto'>
        <div
          ref={previewRef}
          className='rounded-2xl overflow-hidden shadow-2xl border border-gray-200 max-w-6xl mx-auto bg-white transition-all duration-700 transform opacity-0 translate-y-8'
        >
          {/* Product Preview Image */}
          <div className='aspect-[16/9] bg-gradient-to-r from-indigo-50 via-white to-purple-50 relative'>
            {/* App Interface Mockup */}
            <div className='absolute inset-0 flex flex-col'>
              {/* Top Bar */}
              <div className='h-12 bg-white border-b border-gray-200 flex items-center px-4'>
                <div className='w-3 h-3 rounded-full bg-red-400 mr-2'></div>
                <div className='w-3 h-3 rounded-full bg-yellow-400 mr-2'></div>
                <div className='w-3 h-3 rounded-full bg-green-400 mr-4'></div>
                <div className='h-6 w-64 bg-gray-100 rounded-md'></div>
                <div className='ml-auto flex space-x-3'>
                  <div className='h-6 w-6 rounded-full bg-gray-100'></div>
                  <div className='h-6 w-6 rounded-full bg-gray-100'></div>
                  <div className='h-6 w-6 rounded-full bg-gray-100'></div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className='flex-1 flex'>
                {/* Left Sidebar */}
                <div className='w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-3'>
                  <div className='h-8 bg-gray-100 rounded-md mb-3 w-full'></div>
                  <div className='h-6 bg-gray-100 rounded-md mb-2 w-3/4'></div>
                  <div className='h-6 bg-gray-100 rounded-md mb-2 w-5/6'></div>
                  <div className='h-6 bg-gray-100 rounded-md mb-2 w-4/5'></div>
                  <div className='h-6 bg-indigo-100 rounded-md mb-2 w-5/6'></div>
                  <div className='mt-auto h-20 bg-gray-100 rounded-md w-full'></div>
                </div>

                {/* Whiteboard Canvas */}
                <div className='flex-1 bg-white p-3 relative'>
                  {/* Canvas Elements */}
                  <div className='absolute top-10 left-10 w-48 h-32 bg-blue-50 rounded-md border border-blue-200 shadow-sm'></div>
                  <div className='absolute top-24 left-64 w-56 h-40 bg-amber-50 rounded-md border border-amber-200 shadow-sm'></div>
                  <div className='absolute top-72 left-20 w-64 h-32 bg-green-50 rounded-md border border-green-200 shadow-sm'></div>

                  {/* Connection Lines */}
                  <svg
                    className='absolute inset-0 w-full h-full pointer-events-none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M80 60 L 120 120'
                      stroke='#CBD5E1'
                      strokeWidth='2'
                      fill='none'
                    />
                    <path
                      d='M180 140 L 100 200'
                      stroke='#CBD5E1'
                      strokeWidth='2'
                      fill='none'
                    />
                  </svg>

                  {/* Cursor */}
                  <div className='absolute top-40 left-48 flex items-center'>
                    <div className='w-5 h-5 bg-indigo-500 rounded-full shadow-md'></div>
                    <div className='ml-2 bg-indigo-500 text-white text-xs py-1 px-2 rounded shadow-md'>
                      User 1
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className='w-56 bg-gray-50 border-l border-gray-200 p-3 flex flex-col'>
                  <div className='h-8 bg-gray-100 rounded-md mb-4 w-full'></div>
                  <div className='h-24 bg-gray-100 rounded-md mb-3 w-full'></div>
                  <div className='h-6 bg-gray-100 rounded-md mb-2 w-2/3'></div>
                  <div className='h-6 bg-gray-100 rounded-md mb-2 w-3/4'></div>
                  <div className='mt-auto'>
                    <div className='h-8 bg-indigo-100 rounded-md w-full mb-3'></div>
                    <div className='h-8 bg-gray-100 rounded-md w-full'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Tags */}
        <div className='flex flex-wrap justify-center gap-3 mt-6'>
          {[
            "Real-time collaboration",
            "Interactive canvas",
            "Smart objects",
            "Version history",
          ].map((tag) => (
            <div
              key={tag}
              className='bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm border border-gray-100'
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
