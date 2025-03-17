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
  const [difficultyGenres, setDifficultyGenres] = useState<Genre[]>([]);

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
          }
        }
        setInterestGenres(interestGenres);
      }
      const difficultyGenres: Genre[] = [];
      let minEvaluation = 1;
      while (difficultyGenres.length === 0 && minEvaluation <= 5) {
        for (const userGenreEvaluation of userGenresEvaluation) {
          if (userGenreEvaluation.evaluation === minEvaluation) {
            const matchingGenre = genres.find(
              (genre) => genre.id === userGenreEvaluation.genreId,
            );
            if (matchingGenre) {
              difficultyGenres.push(matchingGenre);
            }
          }
        }
        if (difficultyGenres.length === 0) {
          minEvaluation += 1;
        } else {
          break;
        }
      }
      setDifficultyGenres(difficultyGenres);
    };
    fetchUserGenresEvaluation();
  }, [userId]);

  return <div>HomeContainer</div>;
};

export default HomeContainer;
