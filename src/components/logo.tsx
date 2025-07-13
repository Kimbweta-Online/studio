import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className || "h-8 w-8 text-primary"}
    >
      <path d="M12 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10c0 2.21-0.714 4.25-1.928 5.928" />
      <path d="M14.5 12c0-5.5-3-9-3-9s-3 3.5-3 9c0 1.5 0.5 3 1.5 4s2.5 1.5 2.5 1.5" />
    </svg>
  );
}
