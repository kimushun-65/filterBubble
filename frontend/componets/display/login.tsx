// LoginContainer.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { fetchUser } from '@/hooks/fetchUser';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

const LoginContainer: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [dbUsers, setDbUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetchUser();
      setDbUsers(users);
      console.log(users);
    };
    fetchUsers();
  }, []);

  const handleLogin = async () => {
    const user = dbUsers.find(
      (user) => user.userName === userName && user.password === password,
    );
    if (user) {
      toast.success('ログイン成功');
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } else {
      toast.error('ログイン失敗');
      console.log('ユーザーが見つかりません');
    }
  };

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center'>
      <div className='absolute inset-0 z-0'>
        <Image
          src='/bubble.jpeg'
          alt='Bubble Background'
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <Toaster position='top-center' />

      <h1 className='z-10 mb-16 flex justify-center text-4xl font-bold text-black'>
        Break Filter Bubble
      </h1>

      <div className='bg-opacity-80 z-10 w-96 rounded-lg bg-gray-100 p-10 shadow-xl'>
        <h2 className='mb-8 text-center text-3xl font-semibold text-slate-700'>
          Login
        </h2>

        <div className='mb-6'>
          <input
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='Username'
            required
            className='w-full rounded border border-gray-300 bg-white p-3'
          />
        </div>

        <div className='mb-8'>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
            className='w-full rounded border border-gray-300 bg-white p-3'
          />
        </div>

        <button
          onClick={handleLogin}
          className='w-full rounded bg-slate-700 py-3 text-white transition-colors hover:bg-slate-800'
        >
          ログイン
        </button>

        <div className='mt-6 text-center'>
          <a href='#' className='text-slate-700 hover:underline'>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
