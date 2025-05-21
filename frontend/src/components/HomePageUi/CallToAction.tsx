"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CallToAction() {
  const ctaRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100");
          entries[0].target.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.2 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section className='relative pt-24 pb-32 overflow-hidden'>
      <div
        className='absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 transform origin-top-right -translate-y-16'
        style={{ background: `linear-gradient(to right, #1e40af, #0f2a7a)` }}
      ></div>

      <div
        ref={ctaRef}
        className='container mx-auto px-6 relative z-10 text-white text-center transition-all duration-700 transform opacity-0 translate-y-8'
      >
        <h2 className='text-3xl sm:text-4xl font-bold mb-6 drop-shadow-sm'>
          Ready to whiteboard with your team?
        </h2>
        <p className='text-lg mb-10 max-w-2xl mx-auto text-white/90'>
          Sign up today and start collaborating in under a minute. No credit
          card required.
        </p>

        <div className='flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto'>
          <Link
            href={user ? "/dashboard" : "/auth/register"}
            className='inline-block px-8 py-4 bg-white font-semibold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl'
            style={{ color: "#1e40af" }}
          >
            Get started free
          </Link>

          <Link
            href='#'
            className='inline-block px-8 py-4 bg-transparent cursor-not-allowed border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white/10 transition-all'
          >
            Contact sales
          </Link>
        </div>

        <div className='mt-12 flex flex-col sm:flex-row items-center justify-center text-sm gap-8'>
          <div className='flex items-center'>
            <svg
              className='w-5 h-5 mr-2'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              ></path>
            </svg>
            <span>Free forever plan</span>
          </div>
          <div className='flex items-center'>
            <svg
              className='w-5 h-5 mr-2'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              ></path>
            </svg>
            <span>No credit card required</span>
          </div>
          <div className='flex items-center'>
            <svg
              className='w-5 h-5 mr-2'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              ></path>
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
