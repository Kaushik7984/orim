"use client";

import { useEffect, useRef } from "react";
import { MousePointerClick, BookOpen, MessageCircle } from "lucide-react"; // Example icons

type Feature = {
  title: string;
  description: string;
  icon: JSX.Element;
};

export default function Features() {
  const featureItems = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-y-0");
              entry.target.classList.remove("opacity-0", "translate-y-8");
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    featureItems.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      featureItems.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  const features: Feature[] = [
    {
      title: "Real-time Collaboration",
      description:
        "Work together with your team in real-time. See cursor movements, edits, and comments as they happen.",
      icon: <MousePointerClick className='w-8 h-8 text-blue-500' />,
    },
    {
      title: "Templates Library",
      description:
        "Start quickly with 100+ professionally designed templates for any use case or industry.",
      icon: <BookOpen className='w-8 h-8 text-green-500' />,
    },
    {
      title: "Live Cursor & Chat",
      description:
        "See where everyone is working and chat in real-time without leaving the whiteboard.",
      icon: <MessageCircle className='w-8 h-8 text-purple-500' />,
    },
  ];

  return (
    <section className='py-16 px-4 max-w-6xl mx-auto'>
      <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-3'>
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => {
              featureItems.current[index] = el;
            }}
            className='transform transition duration-500 opacity-0 translate-y-8 p-6 bg-white rounded-2xl shadow-md'
          >
            <div className='mb-4'>{feature.icon}</div>
            <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
            <p className='text-gray-600'>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
