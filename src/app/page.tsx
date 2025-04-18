"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className='min-h-screen bg-yellow-100 relative overflow-hidden'>
      {/* Decorative Pattern (like Miro) */}
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-50 via-blue-50 to-white opacity-50'></div>
      <div className='absolute -top-10 -left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse'></div>
      <div className='absolute -bottom-10 -right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply blur-2xl opacity-40 animate-pulse delay-1000'></div>

      {/* Header */}
      <header className='sticky top-0 z-50 bg-white shadow-sm mx-40 my-10 rounded-lg'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center'>
          <div className='flex items-center gap-8'>
            <Link href='/'>
              <Image
                src='/orim.svg'
                alt='Logo'
                width={40}
                height={40}
                className='cursor-pointer'
              />
            </Link>

            <nav className='hidden md:flex gap-6 text-sm text-gray-700 font-medium'>
              <button className='hover:text-black'>Product ▾</button>
              <button className='hover:text-black'>Solutions ▾</button>
              <button className='hover:text-black'>Resources ▾</button>
              <Link href='#' className='hover:text-black'>
                Pricing
              </Link>
            </nav>
          </div>

          <div className='flex items-center gap-4 text-sm font-medium'>
            <Link href='#' className='hover:underline'>
              Contact Sales
            </Link>
            <Link href='/auth/login' className='text-gray-700 hover:text-black'>
              Login
            </Link>
            <Link
              href='/auth/register'
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'
            >
              Sign up free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className='relative py-28'>
        <div className='container mx-auto px-6 text-center max-w-4xl'>
          <h1 className='text-5xl font-bold text-gray-900 leading-tight'>
            Collaborate visually with your team in real time
          </h1>
          <p className='mt-6 text-lg text-gray-600'>
            Brainstorm, plan, and design on a shared online whiteboard with
            seamless live collaboration.
          </p>
          <div className='mt-10 flex justify-center gap-4 flex-wrap'>
            <Link
              href='/auth/login'
              className='px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition shadow-md'
            >
              Get started
            </Link>
            <Link
              href='/demo'
              className='px-8 py-4 border border-gray-300 text-lg rounded-lg text-gray-800 hover:bg-gray-100 transition'
            >
              Watch demo
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Image - Commented out until we have a valid image */}
      {/* <section className='py-12'>
        <div className='container flex items-center justify-center mx-auto px-6'>
          <div className='rounded-xl overflow-hidden shadow-xl border border-gray-200'>
            <Image
              src='/whiteboard1.webp'
              alt='Whiteboard'
              width={1000}
              height={200}
            />
          </div>
        </div>
      </section> */}

      {/* Features */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900'>
              Built for teams that move fast
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Tools and features to help you work better together.
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-12'>
            {[
              {
                title: "Real-time Collaboration",
                desc: "Instantly see everyone's updates, no refresh needed.",
                icon: "https://img.icons8.com/fluency/48/synchronize.png",
              },
              {
                title: "Templates Library",
                desc: "100+ pre-made templates to kickstart your ideas.",
                icon: "https://img.icons8.com/fluency/48/template.png",
              },
              {
                title: "Live Cursor & Chat",
                desc: "Track teammates' cursors and chat live as you work.",
                icon: "https://img.icons8.com/fluency/48/chat.png",
              },
            ].map((f, i) => (
              <div
                key={i}
                className='bg-white p-8 rounded-xl shadow hover:shadow-md border transition'
              >
                <div className='w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-5'>
                  <Image src={f.icon} alt={f.title} width={32} height={32} />
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
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-6 text-center max-w-3xl'>
          <h2 className='text-3xl font-bold mb-10 text-gray-900'>
            Trusted by teams at
          </h2>
          <div className='flex flex-wrap justify-center gap-8'>
            {["Google", "Netflix", "Spotify", "Airbnb", "Uber"].map((brand) => (
              <div
                key={brand}
                className='text-gray-500 text-xl font-medium hover:text-gray-700 transition'
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 bg-gradient-to-r from-yellow-200 to-orange-100 text-black text-center'>
        <div className='container mx-auto px-6'>
          <h2 className='text-4xl font-bold mb-6'>
            Ready to whiteboard with your team?
          </h2>
          <p className='text-lg mb-10'>
            Sign up and start collaborating in under a minute.
          </p>
          <Link
            href='/auth/login'
            className='px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-lg hover:bg-gray-100 transition'
          >
            Get started now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-gray-300 py-10'>
        <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center'>
          <div className='flex items-center gap-3 mb-4 md:mb-0'>
            <Image src='/orim.svg' alt='Logo' width={32} height={32} />
            <span className='text-white font-medium text-lg'>Orim</span>
          </div>
          <p className='text-sm text-gray-400'>
            &copy; {new Date().getFullYear()} Orim. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
