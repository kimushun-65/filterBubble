import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import toast, { Toaster } from 'react-hot-toast';

interface SignUpModalProps {
  onClose?: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const usersCollection = collection(db, 'users');
      const userId = generateRandomId();
      const userDocRef = doc(usersCollection, userId);
      await setDoc(userDocRef, {
        userName,
        password,
        createdAt: serverTimestamp(),
        userId: userId, // Store the userId in the document as well
      });

      toast.success('アカウント作成成功');

      if (onClose) {
        onClose();
      }

      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('アカウント作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-500'>
      <div className='w-96 rounded-lg bg-white p-8 shadow-xl'>
        <Toaster position='top-center' />

        <h2 className='mb-6 text-center text-2xl font-semibold text-slate-700'>
          アカウント作成
        </h2>

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
            className='flex-1 rounded bg-slate-700 py-3 text-white transition-colors hover:bg-slate-800 disabled:bg-slate-400'
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
  );
};

export default SignUpModal;
