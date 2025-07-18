import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className || "h-8 w-8 text-primary"}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--accent-foreground))', stopOpacity: 1}} />
        </linearGradient>
      </defs>
       <path 
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2" 
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
       />
      <path 
        d="M15.5 14.5A7.5 7.5 0 0 1 8 18.8c-2.3 0-4.4-.9-6-2.5.8-2.3 2.5-4.2 4.9-5.2 2.7-1.1 5.8-1.2 8.6-.3m-3-6.5a4 4 0 0 0-4.8 3.2c-.4.8-.5 1.7-.3 2.5.3 1.2 1.2 2.2 2.4 2.7 1.5.6 3.2.3 4.5-.8s1.9-3 1.5-4.7c-.3-1.4-1.4-2.5-2.8-2.9z" 
        fill="url(#logoGradient)"
        stroke="none"
      />
      <path
        d="M10.5 11.5l1-2 1.5 3 2-4 1.5 3"
        strokeWidth="1"
        stroke="hsl(var(--primary-foreground))"
      />
    </svg>
  );
}
