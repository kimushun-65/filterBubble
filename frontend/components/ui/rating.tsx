'use client';
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Genre } from '@/types/genres';

interface RatingProps {
  genre: Genre;
  rating: number;
  onChange: (genre: Genre, value: number) => void;
  totalStars?: number;
  size?: number;
  setRating: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({
  genre,
  rating,
  onChange,
  totalStars = 5,
  size = 24,
  setRating,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clickedRating, setClickedRating] = useState<number>(0);

  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              // ホバー時またはクリック時に星を塗りつぶす
              hoverRating >= starValue || clickedRating >= starValue
                ? 'fill-primary text-primary'
                : 'text-muted-foreground fill-none',
              'cursor-pointer transition-colors',
            )}
            onClick={() => {
              onChange(genre, starValue); // hoverRatingではなくstarValueを使用
              setClickedRating(starValue);
              setRating(starValue); // 親コンポーネントにも値を渡す
            }}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => {
              setHoverRating(0); // マウスが離れたら0に戻す
            }}
          />
        );
      })}
    </div>
  );
};

export default Rating;
