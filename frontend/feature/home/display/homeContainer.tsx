import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchGenresEvaluation } from '@/hooks/fetchGenresEvaluation';
import { fetchGenre } from '@/hooks/fetchGenre';
import { Button } from '@/components/ui/button';

import { UserGenresEvaluation } from '@/types/userGenresEvaluation';
import { Genre } from '@/types/genres';
import Loading from '@/components/display/loading';

const HomeContainer = () => {
  const { userId } = useParams();
  const [userGenresEvaluation, setUserGenresEvaluation] = useState<
    UserGenresEvaluation[]
  >([]);
  const [interestGenres, setInterestGenres] = useState<Genre[]>([]);
  const [difficultyGenres, setDifficultyGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    // Implement get articles functionality
    console.log('Getting articles...');
  };

  const handleReset = () => {
    // Implement reset functionality
    console.log('Resetting...');
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='mx-auto flex min-h-screen max-w-md flex-col pt-6'>
      {/* Header */}
      <header className='mb-12 flex items-center justify-between px-4 shadow-lg'>
        <h1 className='relative mb-2 ml-6 border-b-2 px-4 py-2 text-3xl font-bold text-slate-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-[#00D2FF] after:to-[#3A7BD5]'>
          Break Filter Bubble
        </h1>
        <button className='p-2' aria-label='Settings'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-slate-700'
          >
            <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'></path>
            <circle cx='12' cy='12' r='3'></circle>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className='flex flex-grow flex-col items-center justify-start gap-24 px-4'>
        {/* Get Articles Button */}
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

        {/* Interest Genres Card */}
        <div className='w-full rounded-lg border p-6 shadow-xl'>
          <div className='relative mb-6 pl-4'>
            <div className='absolute top-0 left-0 h-full w-1.5 rounded-sm bg-gradient-to-b from-[#00D2FF] to-[#3A7BD5]'></div>
            <h2 className='text-2xl font-semibold text-slate-800'>
              Your Interest Genre
            </h2>
          </div>

          <div className='space-y-4'>
            {interestGenres.length > 0 ? (
              interestGenres.map((genre) => (
                <div key={genre.id} className='flex items-center gap-3'>
                  <span className='text-slate-800'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <rect x='3' y='8' width='18' height='12' rx='2'></rect>
                      <path d='M7 8V6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2'></path>
                    </svg>
                  </span>
                  <span className='text-lg'>{genre.genreName}</span>
                </div>
              ))
            ) : (
              <p className='text-slate-500'>No interest genres found.</p>
            )}
          </div>

          <div className='mt-6'>
            <Button
              variant='outline'
              className='flex w-full items-center justify-center gap-2 border-2 border-transparent bg-white py-4 text-[#3A7BD5] hover:bg-gradient-to-r hover:from-[#00D2FF] hover:to-[#3A7BD5] hover:text-white'
              onClick={handleReset}
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

      {/* Footer */}
      <footer>
        <div className='flex h-full w-full items-center justify-center rounded-md bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] py-4 text-white'>
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
            className='mr-2'
          >
            <circle cx='12' cy='12' r='10'></circle>
            <path d='M12 8v8'></path>
            <path d='M8 12h8'></path>
          </svg>
          Break Filter Bubble
        </div>
      </footer>
    </div>
  );
};

export default HomeContainer;
