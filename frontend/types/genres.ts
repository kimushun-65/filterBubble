export interface Genre {
  id: string;
  genreName: string;
  keyWords: string[];
  userId?: string;
  evaluation?: number;
  createdAt?: Date;
}

export interface EvaluatedGenre {
  userId: string;
  genreId: string;
  evaluation: number;
  createdAt: Date;
}
