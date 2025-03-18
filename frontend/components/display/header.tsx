import React from 'react';
import { House } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
const Header = () => {
  const { userId } = useParams();
  const router = useRouter();
  const onClick = () => {
    router.push(`/home/${userId}`);
  };
  return (
    <header className='mb-12 flex items-center justify-between px-4 shadow-lg'>
      <h1 className='relative mb-2 ml-6 border-b-2 px-4 py-2 text-3xl font-bold text-slate-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-[#00D2FF] after:to-[#3A7BD5]'>
        Break Filter Bubble
      </h1>
      <button className='p-2' aria-label='Settings' onClick={onClick}>
        <House className='text-slate-700' size={24} />
      </button>
    </header>
  );
};

export default Header;
