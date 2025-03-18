'use strict';
import React, { useState } from 'react';
import Rating from './rating';
import { Genre } from '@/types/genres';

interface RatingDisplayProps {
  genre: Genre;
  onChange: (genre: Genre, value: number) => void;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ onChange, genre }) => {
  const [rating, setRating] = useState(0);

  return (
    <div className='p-4'>
      <Rating
        rating={rating}
        onChange={onChange}
        setRating={setRating}
        genre={genre}
      />
      {/* <p className='mt-2'>現在の評価: {rating}</p> */}
    </div>
  );
};

export default RatingDisplay;
