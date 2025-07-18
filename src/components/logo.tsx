import React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://placehold.co/32x32.png"
      alt="Mindset Theater Logo"
      width={32}
      height={32}
      className={className || 'h-8 w-8'}
      aria-hidden="true"
    />
  );
}
