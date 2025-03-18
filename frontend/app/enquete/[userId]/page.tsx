'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { fetchGenre } from '@/hooks/fetchGenre';
import { Genre } from '@/types/genres';
import { EvaluatedGenre } from '@/types/genres';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import RatingDisplay from '@/components/ui/ratingDisplay';

const Enquete = () => {
  const [evaluatedGenres, setEvaluatedGenres] = useState<EvaluatedGenre[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const params = useParams();
  const userId = String(params.userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genres = await fetchGenre();
        setGenres(genres);
      } catch (error) {
        console.error('ジャンル取得エラー:', error);
      }
    };
    fetchData();
  }, []);

  const setEvaluation = (genre: Genre, evaluation: number) => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
    const created = new Date();
    const evaluatedGenre = {
      id: genre.id,
      genreName: genre.genreName,
      keyWords: genre.keyWords,
      userId: userId,
      evaluation: evaluation,
      createdAt: created,
    };

    genres.forEach((genre, index) => {
      if (genre.id === evaluatedGenre.id) {
        const newEvaluatedGenres = genres.slice();
        newEvaluatedGenres[index] = evaluatedGenre;
        setGenres(newEvaluatedGenres);
      }
    });
  };

  console.log('😭😭😭');
  genres.forEach((genre) => {
    console.log(genre.evaluation);
  });

  const updateEvaluation = () => {
    genres.forEach((genre) => {
      console.log(genre);
      const addEvaluation = async () => {
        const docRef = await addDoc(collection(db, 'usersGenresEvaluation'), {
          userId: genre.userId,
          genreId: genre.id,
          evaluation: genre.evaluation,
          createdAt: genre.createdAt,
        });
        console.log('Document written with ID: ', docRef.id);
      };
      addEvaluation();
    });
  };

  console.log(evaluatedGenres);
  return (
    <div>
      <ul>
        {genres?.map((genre) => {
          return (
            <li key={genre.id} >
              <Image
                src='/museum.svg'
                width={25}
                height={25}
                alt='画像'
              ></Image>
              <p>{genre.genreName}</p>
              <RatingDisplay
                onChange={setEvaluation}
                genre={genre}
              ></RatingDisplay>
            </li>
          );
        })}
      </ul>
      <button aria-label='送信する' onClick={updateEvaluation}>
        submit
      </button>
    </div>
  );
};

export default Enquete;
