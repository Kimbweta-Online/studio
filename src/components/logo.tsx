import React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://i.ibb.co/3my9sWWF/mt-logo.png"
      alt="Mindset Theater Logo"
      width={64}
      height={64}
      className={className || 'h-16 w-16'}
      aria-hidden="true"
    />
  );
}
