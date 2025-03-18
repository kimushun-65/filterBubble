import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import Loading from '@/components/display/loading';
import Header from '@/components/display/header';
import Footer from '@/components/display/footer';
import { Handshake } from 'lucide-react';

export const ArticleContainer = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-grow'>
        <h1>Article</h1>
      </main>
      <Footer />
    </div>
  );
};
