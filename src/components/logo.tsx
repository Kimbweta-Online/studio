import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className || 'h-8 w-8'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2m0 0V1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2m0 0V1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 18.5A2.5 2.5 0 0 1 9.5 21v0A2.5 2.5 0 0 1 7 18.5v0A2.5 2.5 0 0 1 9.5 16v0A2.5 2.5 0 0 1 12 18.5m0 0V22"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 18.5A2.5 2.5 0 0 0 14.5 21v0A2.5 2.5 0 0 0 17 18.5v0A2.5 2.5 0 0 0 14.5 16v0A2.5 2.5 0 0 0 12 18.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M16 12.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M4.5 7A2.5 2.5 0 0 1 7 9.5v0A2.5 2.5 0 0 1 4.5 12v0A2.5 2.5 0 0 1 2 9.5v0A2.5 2.5 0 0 1 4.5 7m0 0H6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M19.5 7A2.5 2.5 0 0 1 22 9.5v0A2.5 2.5 0 0 1 19.5 12v0A2.5 2.5 0 0 1 17 9.5v0A2.5 2.5 0 0 1 19.5 7m0 0H18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9.5 2a2.5 2.5 0 0 0-2.5 2.5M14.5 2a2.5 2.5 0 0 1 2.5 2.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
