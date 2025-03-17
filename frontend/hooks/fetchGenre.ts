import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Genre } from '@/types/genres';

export const fetchGenre = async (): Promise<Genre[]> => {
  const genresCollection = collection(db, 'genres');
  const genresSnapshot = await getDocs(genresCollection);
  return genresSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Genre, 'id'>),
  }));
};
