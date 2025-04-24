"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    handleClose();
  };

  return (
    <main className='min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 relative overflow-hidden'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-8'>
            <Link href='/'>
              <Image
                src='/orim.svg'
                alt='Logo'
                width={120}
                height={120}
                className='cursor-pointer hover:opacity-90 transition-opacity'
              />
            </Link>

            <nav className='hidden md:flex gap-6 text-sm text-gray-700 font-medium'>
              <button className='hover:text-black transition-colors flex items-center gap-1 group'>
                Product
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 group-hover:translate-y-0.5 transition-transform'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
              <button className='hover:text-black transition-colors flex items-center gap-1 group'>
                Solutions
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 group-hover:translate-y-0.5 transition-transform'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
              <button className='hover:text-black transition-colors flex items-center gap-1 group'>
                Resources
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 group-hover:translate-y-0.5 transition-transform'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
              <Link href='#' className='hover:text-black transition-colors'>
                Pricing
              </Link>
            </nav>
          </div>

          <div className='flex items-center gap-4 text-sm font-medium'>
            <Link
              href='#'
              className='hidden md:block text-gray-600 hover:text-black transition-colors'
            >
              Contact Sales
            </Link>
            {user ? (
              <>
                <IconButton size='small' onClick={handleMenu}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#4f46e5",
                      fontSize: "0.875rem",
                    }}
                    src={user.photoURL || undefined}
                  >
                    {user.displayName?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      mt: 1,
                      borderRadius: "0.5rem",
                      minWidth: "180px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => router.push("/profile")}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <div className='flex items-center gap-3'>
                <Link
                  href='/auth/login'
                  className='text-gray-600 hover:text-black transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/auth/register'
                  className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md'
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className='relative py-20 md:py-28'>
        <div className='container mx-auto px-6 text-center max-w-4xl'>
          <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 leading-tight'>
            Collaborate visually with your team in{" "}
            <span className='text-indigo-600'>real time</span>
          </h1>
          <p className='mt-6 text-lg text-gray-600 max-w-2xl mx-auto'>
            Brainstorm, plan, and design on a shared online whiteboard with
            seamless live collaboration.
          </p>
          <div className='mt-10 flex justify-center gap-4 flex-wrap'>
            <Link
              href='/dashboard'
              className='px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg'
            >
              Get started
            </Link>
            <Link
              href='/demo'
              className='px-6 py-3 sm:px-8 sm:py-4 border border-gray-300 text-lg rounded-lg text-gray-800 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md'
            >
              Watch demo
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Image */}
      <section className='py-12 px-4'>
        <div className='container mx-auto'>
          <div className='rounded-xl overflow-hidden shadow-2xl border border-gray-200 max-w-5xl mx-auto'>
            <div className='aspect-video bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center'>
              <div className='text-center p-8'>
                <svg
                  className='w-20 h-20 mx-auto text-indigo-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  ></path>
                </svg>
                <h3 className='mt-4 text-xl font-medium text-gray-900'>
                  Whiteboard Preview
                </h3>
                <p className='mt-2 text-gray-600'>
                  Interactive collaboration space with real-time updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900'>
              Built for teams that move fast
            </h2>
            <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
              Tools and features to help you work better together.
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                title: "Real-time Collaboration",
                desc: "Instantly see everyone's updates, no refresh needed.",
                icon: (
                  <svg
                    className='w-8 h-8 text-indigo-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    ></path>
                  </svg>
                ),
              },
              {
                title: "Templates Library",
                desc: "100+ pre-made templates to kickstart your ideas.",
                icon: (
                  <svg
                    className='w-8 h-8 text-indigo-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                    ></path>
                  </svg>
                ),
              },
              {
                title: "Live Cursor & Chat",
                desc: "Track teammates' cursors and chat live as you work.",
                icon: (
                  <svg
                    className='w-8 h-8 text-indigo-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    ></path>
                  </svg>
                ),
              },
            ].map((f, i) => (
              <div
                key={i}
                className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all hover:-translate-y-1'
              >
                <div className='w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-5'>
                  {f.icon}
                </div>
                <h3 className='text-xl font-semibold mb-2 text-gray-900'>
                  {f.title}
                </h3>
                <p className='text-gray-600'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-6 text-center max-w-4xl'>
          <h2 className='text-3xl font-bold mb-10 text-gray-900'>
            Trusted by innovative teams worldwide
          </h2>
          <div className='flex flex-wrap justify-center gap-8 items-center'>
            {["Google", "Netflix", "Spotify", "Airbnb", "Uber"].map((brand) => (
              <div
                key={brand}
                className='text-gray-500 text-xl font-medium hover:text-gray-700 transition-colors opacity-80 hover:opacity-100'
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center'>
        <div className='container mx-auto px-6'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
            Ready to whiteboard with your team?
          </h2>
          <p className='text-lg mb-10 max-w-2xl mx-auto'>
            Sign up and start collaborating in under a minute.
          </p>
          <Link
            href='/auth/register'
            className='inline-block px-8 py-3 bg-white text-indigo-600 font-semibold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl'
          >
            Get started now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-gray-300 py-12'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center gap-3 mb-6 md:mb-0'>
              <Image
                src='/orim.svg'
                alt='Logo'
                width={120}
                height={120}
                className='filter brightness-0 invert'
              />
            </div>
            <div className='flex gap-6 mb-6 md:mb-0'>
              <Link
                href='#'
                className='hover:text-white transition-colors text-sm'
              >
                Privacy
              </Link>
              <Link
                href='#'
                className='hover:text-white transition-colors text-sm'
              >
                Terms
              </Link>
              <Link
                href='#'
                className='hover:text-white transition-colors text-sm'
              >
                Contact
              </Link>
            </div>
            <p className='text-sm text-gray-400'>
              &copy; {new Date().getFullYear()} Orim. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
