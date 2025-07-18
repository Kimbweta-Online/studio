import React from 'react';

export function Logo({className}: {className?: string}) {
  return (
    <svg
      className={className || 'h-8 w-8'}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor">
      <path d="M50,5A45,45,0,1,1,5,50,45,45,0,0,1,50,5m0-5A50,50,0,1,0,100,50,50,50,0,0,0,50,0h0Z" />
      <path d="M50,20A30,30,0,1,1,20,50,30,30,0,0,1,50,20m0-5A35,35,0,1,0,85,50,35,35,0,0,0,50,15h0Z" />
      <circle cx="50" cy="50" r="10" />
    </svg>
  );
}
