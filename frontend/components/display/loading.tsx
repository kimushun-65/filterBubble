import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='relative size-24 animate-spin'>
        <span className='absolute top-0 left-1/2 size-6 -translate-x-1/2 rounded-full bg-[#00D2FF] opacity-75 shadow-lg'></span>
        <span className='absolute bottom-0 left-1/2 size-6 -translate-x-1/2 rounded-full bg-[#0CBDFB] opacity-75 shadow-lg'></span>
        <span className='absolute top-1/2 left-0 size-6 -translate-y-1/2 rounded-full bg-[#19A7F5] opacity-75 shadow-lg'></span>
        <span className='absolute top-1/2 right-0 size-6 -translate-y-1/2 rounded-full bg-[#2F80ED] opacity-75 shadow-lg'></span>
      </div>
    </div>
  );
};

export default Loading;
