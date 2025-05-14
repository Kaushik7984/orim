"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      quote:
        "Orime has transformed how our product team collaborates. The real-time features make remote work feel seamless.",
      author: "Sarah Chen",
      role: "Product Manager",
      company: "Dropbox",
    },
    {
      quote:
        "We've cut our planning time in half since adopting Orime. The templates are incredible and save us so much time.",
      author: "Marcus Johnson",
      role: "CTO",
      company: "Figma",
    },
    {
      quote:
        "The infinite canvas gives us the freedom to think big. Our creative sessions are more productive than ever.",
      author: "Emily Rodriguez",
      role: "Design Director",
      company: "Airbnb",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            containerRef.current?.classList.add("opacity-100");
            containerRef.current?.classList.remove(
              "opacity-0",
              "translate-y-8"
            );
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(containerRef.current);

      return () => {
        if (containerRef.current) observer.unobserve(containerRef.current);
      };
    }
  }, []);

  return (
    <section className='py-20 bg-gray-50'>
      <div
        ref={containerRef}
        className='container mx-auto px-6 transition-all duration-700 transform opacity-0 translate-y-8'
      >
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: "radial-gradient(black 1px, transparent 2px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Trusted by innovative teams worldwide
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className='max-w-4xl mx-auto'>
          <div className='relative bg-white rounded-2xl shadow-lg p-8 md:p-10'>
            {/* Quote Icon */}
            <div className='absolute top-6 left-6 text-indigo-200 opacity-50'>
              <svg
                width='45'
                height='36'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M13.415.43c5.338 0 8.599 3.17 8.599 7.936 0 5.338-3.54 8.95-9.62 13.33l-4.569-3.26c4.568-2.29 6.86-4.57 7.51-6.31-1.08.43-2.29.65-3.54.65C5.338 12.77 0 9.05 0 4.13 0 1.84 1.73 0 3.87 0 5.6 0 7.22.43 8.309.87 10.18.43 11.91.43 13.415.43zm21.194 0c5.337 0 8.598 3.17 8.598 7.936 0 5.338-3.54 8.95-9.62 13.33l-4.568-3.26c4.568-2.29 6.86-4.57 7.51-6.31-1.08.43-2.29.65-3.54.65-6.31 0-11.648-3.72-11.648-8.64 0-2.29 1.73-4.13 3.87-4.13 1.73 0 3.35.43 4.44.87 1.87-.43 3.6-.43 5.108-.43z' />
              </svg>
            </div>

            {/* Testimonial Slider */}
            <div className='relative overflow-hidden h-56'>
              <div
                className='transition-transform duration-500 ease-in-out h-full flex'
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className='min-w-full px-8 flex flex-col justify-center'
                  >
                    <p className='text-xl md:text-2xl text-gray-700 italic'>
                      &quot;`{testimonial.quote}&quot;
                    </p>
                    <div className='mt-6 flex items-center'>
                      <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold'>
                        {testimonial.author.charAt(0)}
                      </div>
                      <div className='ml-4'>
                        <p className='font-medium text-gray-900'>
                          {testimonial.author}
                        </p>
                        <p className='text-gray-500 text-sm'>
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            <div className='flex justify-center mt-6 gap-2'>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "w-6 bg-indigo-600" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Brands */}
        <div className='mt-16 flex flex-wrap justify-center gap-x-12 gap-y-8 items-center'>
          {["Google", "Netflix", "Spotify", "Airbnb", "Uber", "Dropbox"].map(
            (brand) => (
              <div
                key={brand}
                className='text-gray-400 text-lg font-medium hover:text-gray-600 transition-colors'
              >
                {brand}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
