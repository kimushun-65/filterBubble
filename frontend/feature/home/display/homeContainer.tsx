import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchGenresEvaluation } from '@/hooks/fetchGenresEvaluation';
import { fetchGenre } from '@/hooks/fetchGenre';

import { UserGenresEvaluation } from '@/types/userGenresEvaluation';
import { Genre } from '@/types/genres';

const HomeContainer = () => {
  const { userId } = useParams();
  const [userGenresEvaluation, setUserGenresEvaluation] = useState<
    UserGenresEvaluation[]
  >([]);
  const [interestGenres, setInterestGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchUserGenresEvaluation = async () => {
      const userGenresEvaluation = await fetchGenresEvaluation();
      setUserGenresEvaluation(userGenresEvaluation);
      const genres = await fetchGenre();
      const interestGenres: Genre[] = [];
      for (const userGenreEvaluation of userGenresEvaluation) {
        if (userGenreEvaluation.evaluation === 5) {
          const matchingGenre = genres.find(
            (genre) => genre.id === userGenreEvaluation.genreId,
          );
          if (matchingGenre) {
            interestGenres.push(matchingGenre);
            console.log(matchingGenre);
          }
        }
      }
    };
    fetchUserGenresEvaluation();
  }, [userId]);
  return <div>HomeContainer</div>;
};

export default HomeContainer;
