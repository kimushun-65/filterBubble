import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Loading from '@/components/display/loading';
import Header from '@/components/display/header';
import Footer from '@/components/display/footer';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export const ArticleContainer = () => {
  const router = useRouter();
  const { userId, keyWord } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/article?keyWord=${keyWord}`);
        const data = await response.json();
        setTitle(data.article.articles.title);
        setContent(data.article.articles.content);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [keyWord]);

  const handleHomeClick = () => {
    router.push(`/home/${userId}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex flex-grow flex-col'>
        {/* Genre banner */}
        <div className='w-full bg-gradient-to-r from-blue-300 to-blue-500 py-6 text-center'>
          <h2 className='text-2xl font-bold text-white'>ジャンル名</h2>
        </div>

        {/* Article card */}
        <div className='flex flex-grow justify-center px-4 py-8'>
          <div className='flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
            {/* Title section */}
            <div className='p-6 text-center'>
              <h1 className='mb-2 text-3xl font-bold text-gray-800'>{title}</h1>
              <div className='mx-auto h-0.5 w-full bg-blue-400'></div>
            </div>

            {/* Content section */}
            <div className='px-6 pt-4'>
              <h3 className='mb-4 text-center text-xl font-bold'>記事内容</h3>
              <div className='mb-6 max-h-[400px] overflow-y-auto'>
                <p className='whitespace-pre-line text-gray-700'>{content}</p>
              </div>
            </div>

            {/* Home button */}
            <div className='px-6 pb-6'>
              <Button
                className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600'
                onClick={handleHomeClick}
              >
                <Settings className='h-5 w-5' />
                home
                <Settings className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
