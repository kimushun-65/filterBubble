// LoginContainer.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { fetchUser } from '@/hooks/fetchUser';

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
      router.push('/home');
    } else {
      console.log('ユーザーが見つかりません');
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <div>
        <label>ユーザー名</label>
        <input
          type='text'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder='example@example.com'
          required
        />
      </div>
      <div>
        <label>パスワード</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
};

export default LoginContainer;
