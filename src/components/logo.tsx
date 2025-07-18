import React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://i.ibb.co/3my9sWWF/mt-logo.png"
      alt="Mindset Theater Logo"
      width={32}
      height={32}
      className={className || 'h-8 w-8'}
      aria-hidden="true"
    />
  );
}
