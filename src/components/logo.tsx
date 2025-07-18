import React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://i.ibb.co/3my9sWWF/mt-logo.png"
      alt="Mindset Theater Logo"
      width={48}
      height={48}
      className={className || 'h-12 w-12'}
      aria-hidden="true"
    />
  );
}
