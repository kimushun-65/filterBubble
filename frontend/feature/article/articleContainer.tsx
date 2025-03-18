import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Loading from '@/components/display/loading';
import Header from '@/components/display/header';
import Footer from '@/components/display/footer';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export const ArticleContainer = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const keyWord = decodeURIComponent(params.keyWord as string); // URLエンコードをデコード
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `/api/article?keyWord=${encodeURIComponent(keyWord)}`,
        );
        const data = await response.json();
        setTitle(data.article.articles.title);
        setContent(data.article.articles.content);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching article:', error);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };
    fetchArticle();
  }, [keyWord]);

  const handleHomeClick = () => {
    setIsLoading(true);
    router.push(`/home/${userId}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex flex-grow flex-col'>
        <div className='w-full bg-gradient-to-r from-blue-300 to-blue-500 py-3 text-center'>
          <h2 className='text-lg font-bold text-white'>
            キーワード：{keyWord}
          </h2>
        </div>
        <div className='flex flex-grow justify-center px-4 py-3'>
          <div className='flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
            <div className='p-3 text-center'>
              <h1 className='mb-1 text-xl font-bold text-gray-800'>{title}</h1>
              <div className='relative'>
                <div className='absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5]'></div>
              </div>
            </div>
            <div className='px-3 pt-2'>
              <h3 className='mb-2 text-center text-base font-bold'>記事内容</h3>
              <div className='mb-3 max-h-[430px] overflow-y-auto text-sm text-gray-700'>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className='mt-4 mb-2 text-2xl font-bold text-gray-900'>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className='mt-3 mb-2 text-xl font-bold text-gray-800'>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className='mt-2 mb-1 text-lg font-bold text-gray-700'>
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className='text-base leading-relaxed text-gray-600'>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className='list-inside list-disc'>{children}</ul>
                    ),
                    li: ({ children }) => <li className='ml-4'>{children}</li>,
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 underline'
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
            <div className='mt-8 px-3 pb-3'>
              <Button
                className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 py-2 text-sm text-white hover:bg-blue-600'
                onClick={handleHomeClick}
              >
                <Settings className='h-4 w-4' />
                home
                <Settings className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
