import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import toast, { Toaster } from 'react-hot-toast';
import Loading from './loading';

interface SignUpModalProps {
  onClose?: () => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  onClose,
  setIsLoading,
  isLoading,
}) => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const generateRandomId = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSignUp = async () => {
    if (!userName || !password) {
      toast.error('ユーザー名とパスワードを入力してください');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません');
      return;
    }

    try {
      const usersCollection = collection(db, 'users');
      const userId = generateRandomId();
      const userDocRef = doc(usersCollection, userId);
      await setDoc(userDocRef, {
        userName,
        password,
        createdAt: serverTimestamp(),
      });

      toast.success('アカウント作成成功');
      setIsLoading(true);
      setTimeout(() => {
        router.push(`/enquete/${userId}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('アカウント作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-white'>
      <div className='flex flex-col items-center'>
        <h2 className='border-b-gradient-to-r relative z-10 mb-16 flex justify-center border-b-2 from-[#00D2FF] to-[#3A7BD5] px-4 py-2 text-4xl font-bold text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-[#00D2FF] after:to-[#3A7BD5]'>
          アカウント作成
        </h2>
        <div className='w-96 rounded-lg bg-white p-8 shadow-xl'>
          <Toaster position='top-right' />

          <div className='mb-4'>
            <input
              type='text'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='ユーザー名'
              required
              className='w-full rounded border border-gray-300 p-3'
            />
          </div>

          <div className='mb-4'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='パスワード'
              required
              className='w-full rounded border border-gray-300 p-3'
            />
          </div>

          <div className='mb-6'>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='パスワード（確認）'
              required
              className='w-full rounded border border-gray-300 p-3'
            />
          </div>

          <div className='flex space-x-4'>
            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className='flex-1 rounded bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] py-3 text-white transition-colors hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-400'
            >
              {isLoading ? '処理中...' : '登録'}
            </button>

            <button
              onClick={onClose}
              className='flex-1 rounded border border-slate-300 py-3 text-slate-700 transition-colors hover:bg-slate-100'
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
