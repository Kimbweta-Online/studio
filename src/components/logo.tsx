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
      <path d="M12 2a10 10 0 1 0 10 10" stroke="url(#logoGradient)" strokeWidth="2" />
      <path 
        d="M15.5 14.5c-1.2 1.5-3 2.5-5 2.5-3.9 0-7-3.1-7-7 0-2.5 1.3-4.7 3.2-6" 
        stroke="url(#logoGradient)" 
        strokeWidth="2"
      />
      <path 
        d="M13.5 9.5c-.2-.5-.5-1-1-1.5s-1-.8-1.5-1c-.2-.1-.4-.1-.6 0-.3.1-.5.4-.5.7 0 .2.1.4.3.5l1.2.8c.2.1.4.3.5.5l.5 1.2c.1.2.3.4.5.5s.4.1.6 0c.3-.1.5-.4.5-.7s-.1-.5-.3-.6l-1.2-.8c-.2-.1-.4-.3-.5-.5z"
        fill="hsl(var(--primary))"
        stroke="none"
      />
      <path 
        d="M9 12h1l.5-1h1l.5 2 1-3 1 2h1"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
    </svg>
  );
}
