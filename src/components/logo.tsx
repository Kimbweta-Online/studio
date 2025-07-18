import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="https://raw.githubusercontent.com/Kimbweta-Online/studio/master/images/mt_logo.png"
      alt="Mindset Theater Logo"
      className={className || 'h-8 w-8'}
    />
  );
}
