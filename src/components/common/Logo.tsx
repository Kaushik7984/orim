import React from 'react';

const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="512"
      height="512"
      viewBox="0 0 512 512"
      className={className}
    >
      <g>
        <linearGradient id="a" x1="183.54" x2="468.06" y1="183.54" y2="468.07" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopOpacity=".5"></stop>
          <stop offset="1" stopOpacity="0"></stop>
        </linearGradient>
        <rect width="512" height="512" fill="#fe5f55" rx="150" opacity="1"></rect>
        <path fill="url(#a)" d="M512 331.88V362c0 82.84-67.16 150-150 150h-30.13L200.29 380.41l46.31-27.11V213.1l-46.31-46.31 111.42-35.2z" opacity="1"></path>
        <path fill="#ffffff" d="M200.29 380.41v-35.03l25.81-5.47V172.26l-25.81-5.47v-35.21h111.43v35.21l-25.81 5.47v167.65l25.81 5.47v35.03z" opacity="1"></path>
      </g>
    </svg>
  );
};

export default Logo; 