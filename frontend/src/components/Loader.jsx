import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
    </div>
  )
};

export default Loader;