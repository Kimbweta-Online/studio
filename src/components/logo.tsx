import { BrainCircuit } from 'lucide-react';
import React from 'react';

export function Logo({className}: {className?: string}) {
  return (
    <BrainCircuit className={className || 'h-8 w-8'} />
  );
}
