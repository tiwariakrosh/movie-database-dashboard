import type { Movie, Review } from "./types";
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

let moviesCache: Movie[] | null = null;
let reviewsCache: Review[] | null = null;

const getFilePath = (filename: string) =>
  path.join(process.cwd(), 'src', 'data', filename);

export async function readMovies(): Promise<Movie[]> {
  if (moviesCache) return moviesCache;

  try {
    const filePath = getFilePath('movies.json');
    const json = await readFile(filePath, 'utf-8');
    const data = JSON.parse(json) as Movie[];

    if (!Array.isArray(data)) {
      throw new Error('movies.json is not a valid array');
    }

    moviesCache = data;
    return data;
  } catch (error) {
    console.error('Error reading movies.json:', error);
    return [];
  }
}

export async function readReviews(): Promise<Review[]> {
  if (reviewsCache) return reviewsCache;

  try {
    const filePath = getFilePath('reviews.json');
    const json = await readFile(filePath, 'utf-8');
    const data = JSON.parse(json) as Review[];

    if (!Array.isArray(data)) {
      throw new Error('reviews.json is not a valid array');
    }

    reviewsCache = data;
    return data;
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      console.error('Error reading reviews.json:', error);
    }
    return [];
  }
}

export async function writeMovies(movies: Movie[]): Promise<void> {
  try {
    moviesCache = movies;

    const filePath = getFilePath('movies.json');
    const json = JSON.stringify(movies, null, 2);
    await writeFile(filePath, json, 'utf-8');

    console.log('movies.json updated on disk');
  } catch (error) {
    console.error('Error writing movies.json:', error);
    throw error; 
  }
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  try {
    reviewsCache = reviews;

    const filePath = getFilePath('reviews.json');
    const json = JSON.stringify(reviews, null, 2);
    await writeFile(filePath, json, 'utf-8');

    console.log('reviews.json updated on disk');
  } catch (error) {
    console.error('Error writing reviews.json:', error);
    throw error;
  }
}

export async function getNextMovieId(): Promise<number> {
  try {
    const movies = await readMovies();
    return movies.length > 0
      ? Math.max(...movies.map(m => m.id)) + 1
      : 1;
  } catch (error) {
    console.error('Error calculating next movie ID:', error);
    return 1;
  }
}

export async function getNextReviewId(): Promise<number> {
  try {
    const reviews = await readReviews();
    return reviews.length > 0
      ? Math.max(...reviews.map(r => r.id)) + 1
      : 1;
  } catch (error) {
    console.error('Error calculating next review ID:', error);
    return 1;
  }
}

export function clearCache() {
  moviesCache = null;
  reviewsCache = null;
}