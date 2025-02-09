import { Loader2 } from 'lucide-react';
import React from 'react';

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={`bg-transparent flex justify-center items-center ${className}`}
    >
      <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
    </div>
  );
};

export default Loader;
