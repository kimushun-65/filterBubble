import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchGenresEvaluation } from '@/hooks/fetchGenresEvaluation';
import { fetchGenre } from '@/hooks/fetchGenre';
import { Button } from '@/components/ui/button';

import { UserGenresEvaluation } from '@/types/userGenresEvaluation';
import { Genre } from '@/types/genres';
import Loading from '@/components/display/loading';
import { useRouter } from 'next/navigation';
import Header from '@/components/display/header';
import Footer from '@/components/display/footer';
import { Handshake } from 'lucide-react';
import { Computer } from 'lucide-react';
import { FlaskConical } from 'lucide-react';
import { Church } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import { BookX } from 'lucide-react';
import { Landmark } from 'lucide-react';
import { Bike } from 'lucide-react';

const HomeContainer = () => {
  const { userId } = useParams();
  const [userGenresEvaluation, setUserGenresEvaluation] = useState<
    UserGenresEvaluation[]
  >([]);
  const [interestGenres, setInterestGenres] = useState<Genre[]>([]);
  const [difficultyGenres, setDifficultyGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserGenresEvaluation = async () => {
      const userGenresEvaluation = await fetchGenresEvaluation();
      const filteredGenres = userGenresEvaluation.filter(
        (genre) => genre.userId === userId,
      );
      setUserGenresEvaluation(filteredGenres);
      const genres = await fetchGenre();
      const interestGenres: Genre[] = [];
      for (const userGenreEvaluation of filteredGenres) {
        if (
          userGenreEvaluation.evaluation === 4 ||
          userGenreEvaluation.evaluation === 5
        ) {
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
      while (difficultyGenres.length === 0 && minEvaluation <= 3) {
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
    setIsLoading(false);
  }, [userId]);

  const handleGetArticles = () => {
    const randomIndex = Math.floor(
      Math.random() * (difficultyGenres.length - 1),
    );
    const selectedGenre = difficultyGenres[randomIndex];
    const keywords = selectedGenre.keyWords;
    const keyword = keywords[Math.floor(Math.random() * (keywords.length - 1))];
    console.log(keyword);
    //この後バックエンドと接続
    router.push(`/article/${userId}`);
  };

  const handleAgain = () => {
    router.push(`/enquete/${userId}`);
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <main className='flex flex-grow flex-col items-center justify-start gap-24 px-4'>
        <Button
          className='mt-12 flex w-1/2 items-center justify-center gap-2 bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] py-6 text-xl hover:opacity-90'
          onClick={handleGetArticles}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='10'></circle>
            <path d='M12 8v8'></path>
            <path d='M8 12h8'></path>
          </svg>
          Get articles
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='10'></circle>
            <path d='M12 8v8'></path>
            <path d='M8 12h8'></path>
          </svg>
        </Button>

        <div className='w-full rounded-lg border p-6 shadow-xl'>
          <div className='relative mb-6 pl-6'>
            <div className='absolute top-0 left-0 h-full w-2 rounded-md bg-gradient-to-b from-[#00D2FF] via-[#1A9FE5] to-[#3A7BD5]'></div>
            <h2 className='text-2xl font-semibold text-slate-800'>
              Your Interest Genre
            </h2>
          </div>

          <div className='space-y-4'>
            {interestGenres.length > 0 ? (
              interestGenres.map((genre) => {
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
                  <div key={genre.id} className='flex items-center gap-3'>
                    <span className='text-slate-800'>
                      <GenreIcon size={24} />
                    </span>
                    <span className='text-lg'>{genre.genreName}</span>
                  </div>
                );
              })
            ) : (
              <p className='text-slate-500'>No interest genres found.</p>
            )}
          </div>

          <div className='mt-6'>
            <Button
              variant='outline'
              className='border-gradient flex w-full items-center justify-center gap-2 border-2 bg-white from-[#00D2FF] to-[#3A7BD5] py-4 text-[#3A7BD5]'
              onClick={handleAgain}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <path d='M12 8v8'></path>
                <path d='M8 12h8'></path>
              </svg>
              Select Again
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <path d='M12 8v8'></path>
                <path d='M8 12h8'></path>
              </svg>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomeContainer;
