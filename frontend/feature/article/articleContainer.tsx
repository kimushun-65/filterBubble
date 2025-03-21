import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Loading from '@/components/display/loading';
import Header from '@/components/display/header';
import Footer from '@/components/display/footer';
import { Button } from '@/components/ui/button';
import { Settings, X } from 'lucide-react';

export const ArticleContainer = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const keyword = decodeURIComponent(params.keyWord as string); // URLエンコードをデコード
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      const url = `/api/news?keyword=${keyword}`;
      console.log('Fetching article from:', url);
      try {
        const response = await fetch(url);
        console.log(response);

        const data = await response.json();
        console.log(data);
        setTitle(data.title);
        setContent(data.summary);
        setLinks(data.links);
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
  }, [keyword]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex flex-grow flex-col'>
        <div className='w-full bg-gradient-to-r from-blue-300 to-blue-500 py-3 text-center'>
          <h2 className='text-lg font-bold text-white'>
            キーワード：{keyword}
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
                className='flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] py-2 text-sm text-white hover:opacity-90'
                onClick={() => setIsOpen(!isOpen)}
              >
                <Settings className='h-4 w-4' />
                引用記事
                <Settings className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-8 backdrop-blur-sm'>
            <div className='relative flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg'>
              <div className='flex items-center justify-between border-b border-gray-200 p-4'>
                <h3 className='text-lg font-semibold text-gray-900'>引用元</h3>
                <Button
                  size='icon'
                  onClick={() => setIsOpen(false)}
                  className='h-8 w-8 rounded-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] p-0 text-white hover:opacity-90'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>
              <div className='max-h-[60vh] overflow-y-auto p-4'>
                {links && links.length > 0 ? (
                  <ul className='space-y-3'>
                    {links.map((link, index) => (
                      <li key={index} className='p-3 hover:bg-gray-50'>
                        <a
                          href={link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='block text-blue-600 hover:underline'
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-center text-gray-500'>
                    引用記事はありません
                  </p>
                )}
              </div>
              <div className='border-t border-gray-200 p-4'>
                <Button
                  className='w-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white hover:opacity-90'
                  onClick={() => setIsOpen(false)}
                >
                  閉じる
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
