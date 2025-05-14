"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const { user } = useAuth();
  return (
    <section className='relative py-20 sm:py-24 md:py-28 overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        {/* Dot Grid Pattern */}
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: "radial-gradient(black 1px, transparent 2px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Gradient Circles */}
        <div className='absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl' />
        <div className='absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-100 rounded-full opacity-40 blur-3xl' />
      </div>

      <div className='container mx-auto px-6 relative z-10'>
        <motion.div
          className='text-center max-w-4xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight'>
            Collaborate visually with your team in{" "}
            <span style={{ color: "#1e40af" }}>real time</span>
          </h1>

          <p className='mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
            Brainstorm, plan, and design on a shared online whiteboard with
            seamless live collaboration.
          </p>

          <div className='mt-10 flex justify-center gap-4 flex-wrap'>
            <Link
              href={user ? "/dashboard" : "/auth/login"}
              className='group px-6 py-3 sm:px-8 sm:py-4 text-white text-lg rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2'
              style={{ backgroundColor: "#1e40af", borderColor: "#1e40af" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#152e67")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e40af")
              }
            >
              Get started
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 group-hover:translate-x-1 transition-transform'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7l5 5m0 0l-5 5m5-5H6'
                />
              </svg>
            </Link>
            <Link
              href='/demo'
              className='px-6 py-3 sm:px-8 sm:py-4 border text-lg rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2'
              style={{ borderColor: "#1e40af", color: "#1e40af" }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#dde4fc";
                e.currentTarget.style.borderColor = "#1e40af";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#1e40af";
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Watch demo
            </Link>
          </div>

          <div className='mt-8 text-sm text-gray-500'>
            No credit card required • Free plan available
          </div>
        </motion.div>
      </div>
    </section>
  );
}
