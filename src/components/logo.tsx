import Image from 'next/image';
import React from 'react';

export function Logo({className}: {className?: string}) {
  return (
    <Image
      src="https://raw.githubusercontent.com/Kimbweta-Online/studio/master/images/mt_logo.png"
      alt="Mindset Theater Logo"
      width={32}
      height={32}
      className={className || 'h-8 w-8'}
    />
  );
}
