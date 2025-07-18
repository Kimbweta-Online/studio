import { BrainCog } from 'lucide-react';
import React from 'react';

export function Logo({className}: {className?: string}) {
  return (
    <BrainCog className={className || 'h-8 w-8'} />
  );
}
