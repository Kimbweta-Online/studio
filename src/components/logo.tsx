import React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/mt_logo.png"
      alt="Mindset Theater Logo"
      width={32}
      height={32}
      className={className || "h-8 w-8"}
    />
  );
}
