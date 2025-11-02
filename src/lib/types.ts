export interface Movie {
  id: number
  title: string
  year: number
  genre: string[]
  rating: number
  director: string
  runtime: number
  synopsis: string
  cast: string[]
  posterUrl: string
  reviewCount: number
  averageReviewRating: number
}

export interface Review {
  id: number
  movieId: number
  userName: string
  rating: number
  reviewText: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
