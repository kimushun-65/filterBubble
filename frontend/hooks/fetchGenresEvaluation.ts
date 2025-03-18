import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { UserGenresEvaluation } from '@/types/userGenresEvaluation';

export const fetchGenresEvaluation = async (): Promise<
  UserGenresEvaluation[]
> => {
  const genresEvaluationCollection = collection(db, 'usersGenresEvaluation');
  const genresEvaluationSnapshot = await getDocs(genresEvaluationCollection);
  return genresEvaluationSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<UserGenresEvaluation, 'id'>),
  }));
};
