import { Drama } from 'lucide-react';
import React from 'react';

export function Logo({className}: {className?: string}) {
  return (
    <Drama className={className || 'h-8 w-8'} />
  );
}
