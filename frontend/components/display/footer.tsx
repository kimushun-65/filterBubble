import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className='flex h-full w-full items-center justify-center rounded-md bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] py-4 text-white'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2'
        >
          <circle cx='12' cy='12' r='10'></circle>
          <path d='M12 8v8'></path>
          <path d='M8 12h8'></path>
        </svg>
        Break Filter Bubble
      </div>
    </footer>
  );
};

export default Footer;
