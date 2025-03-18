'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { fetchGenre } from '@/hooks/fetchGenre';
import { Genre } from '@/types/genres';
import { EvaluatedGenre } from '@/types/genres';
import Footer from '@/components/display/footer';
import Header from '@/components/display/header';
import { useParams } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import RatingDisplay from '@/components/ui/ratingDisplay';
import styles from './page.module.css';
import { Handshake } from 'lucide-react';
import { Computer } from 'lucide-react';
import { FlaskConical } from 'lucide-react';
import { Church } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import { BookX } from 'lucide-react';
import { Landmark } from 'lucide-react';
import { Bike } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Enquete = () => {
  const [evaluatedGenres, setEvaluatedGenres] = useState<EvaluatedGenre[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const params = useParams();
  const userId = String(params.userId);
  const router = useRouter();

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

  const navigateToHome = () => {
    router.push(`/home/${params.userId}`);
  };

  console.log(evaluatedGenres);
  return (
    <div className='flex h-screen flex-col justify-between bg-[#fcfcf9] text-center'>
      <Header />

      <div className='flex flex-col items-center justify-center'>
        <h2 className='mb-8 text-2xl font-bold'>
          Please add a point of interest
        </h2>
        <div className='flex max-w-[360px] flex-col items-center justify-center rounded-lg border border-black p-5 text-center'>
          <p className='text-xl font-bold'>your interest genre</p>
          <ul>
            {genres?.map((genre) => {
              let GenreIcon;
              switch (genre.genreName) {
                case 'スポーツ':
                  GenreIcon = Bike;
                  break;
                case '宗教':
                  GenreIcon = Church;
                  break;
                case 'IT':
                  GenreIcon = Computer;
                  break;
                case '経済':
                  GenreIcon = CircleDollarSign;
                  break;
                case 'サイエンス':
                  GenreIcon = FlaskConical;
                  break;
                case '社会・環境問題':
                  GenreIcon = Handshake;
                  break;
                case '歴史':
                  GenreIcon = BookX;
                  break;
                case '政治':
                  GenreIcon = Landmark;
                  break;
                default:
                  GenreIcon = Bike;
                  break;
              }

              return (
                <li
                  key={genre.id}
                  className='flex items-center justify-between'
                >
                  <div className='flex'>
                    <GenreIcon size={20} className='mr-4' />
                    <p className='font-bold'>{genre.genreName}</p>
                  </div>
                  <RatingDisplay onChange={setEvaluation} genre={genre} />
                </li>
              );
            })}
          </ul>
          <button
            aria-label='送信する'
            onClick={() => {
              updateEvaluation();
              navigateToHome();
            }}
            className='h-12 w-full rounded-md bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] font-bold text-white'
          >
            submit
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Enquete;
