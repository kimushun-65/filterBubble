import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchGenresEvaluation } from '@/hooks/fetchGenresEvaluation';
import { UserGenresEvaluation } from '@/types/userGenresEvaluation';
const HomeContainer = () => {
  const { userId } = useParams();
  const [userGenresEvaluation, setUserGenresEvaluation] = useState<
    UserGenresEvaluation[]
  >([]);
  useEffect(() => {
    const fetchUserGenresEvaluation = async () => {
      const userGenresEvaluation = await fetchGenresEvaluation();
      console.log(userGenresEvaluation);
    };
    fetchUserGenresEvaluation();
  }, [userId]);
  return <div>HomeContainer</div>;
};

export default HomeContainer;
