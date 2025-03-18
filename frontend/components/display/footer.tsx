import React from 'react';
import { ReactIcon } from '@/feature/home/button/react-icon';
const Footer = () => {
  return (
    <footer>
      <div className='flex h-full w-full items-center justify-center rounded-md bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] py-4 text-white'>
        <ReactIcon />
        Break Filter Bubble
        <ReactIcon />
      </div>
    </footer>
  );
};

export default Footer;
