"use client";

import { useState, useRef, useEffect } from "react";

type NavLinkProps = {
  title: string;
};

export default function NavLink({ title }: NavLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        className='flex items-center gap-1 text-gray-600 hover:text-black transition-colors group'
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        {title}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "group-hover:translate-y-0.5"
          }`}
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

      {isOpen && (
        <div className='absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2'>
          {/* Dropdown content - customize based on the title */}
          {title === "Product" && (
            <>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                Whiteboard
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                Templates
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                Integrations
              </a>
            </>
          )}

          {title === "Solutions" && (
            <>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                For Product Teams
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                For Engineering
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                For Design
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                For Education
              </a>
            </>
          )}

          {title === "Resources" && (
            <>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                Blog
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                Help Center
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                Tutorials
              </a>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#dde4fc";
                  e.currentTarget.style.color = "#1e40af";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                Webinars
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
