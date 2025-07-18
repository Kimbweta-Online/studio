import { Brain } from 'lucide-react';
import React from 'react';

export function Logo({className}: {className?: string}) {
  return (
    <Brain className={className || 'h-8 w-8'} />
  );
}
