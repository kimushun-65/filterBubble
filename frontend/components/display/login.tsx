// LoginContainer.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import SignUpModal from '@/components/display/signUpModal';
import { User } from '@/types/user';
import { fetchUser } from '@/hooks/fetchUser';
import Loading from '@/components/display/loading';

const LoginContainer: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetchUser();
      setDbUsers(users);
      setIsLoading(false);
      console.log(users);
    };
    fetchUsers();
  }, []);

  const handleLogin = async () => {
    const user = dbUsers.find(
      (user) => user.userName === userName && user.password === password,
    );
    console.log(user);
    const userId = user?.id;

    if (user) {
      toast.success('ログイン成功');
      setTimeout(() => {
        router.push(`/home/${userId}`);
      }, 1500);
    } else {
      toast.error('ログイン失敗');
      console.log('ユーザーが見つかりません');
    }
  };
  const handleSignUp = () => {
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

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

      <Toaster position='top-right' />

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
        <div
          className='mt-6 cursor-pointer text-center text-slate-700 hover:underline'
          onClick={handleSignUp}
        >
          アカウント作成
        </div>
      </div>
      {isModalOpen && <SignUpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LoginContainer;
