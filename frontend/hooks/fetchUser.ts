import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { User } from '@/types/user';

export const fetchUser = async (): Promise<User[]> => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<User, 'id'>),
  }));
};
