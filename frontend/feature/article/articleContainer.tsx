import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import Loading from '@/components/display/loading';
import Header from '@/components/display/header';
import Footer from '@/components/display/footer';
import { Handshake } from 'lucide-react';

export const ArticleContainer = () => {
  const { userId, keyWord } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await fetch(`/api/article?keyWord=${keyWord}`);
      const data = await response.json();
      setTitle(data.article.articles.title);
      setContent(data.article.articles.content);
    };
    fetchArticle();
  }, [keyWord]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-grow'>
        <h1>{title}</h1>
        <p>{content}</p>
      </main>
      <Footer />
    </div>
  );
};
