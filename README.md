# Movie Database Dashboard

A modern, full-stack Next.js application serving as an internal movie database dashboard with public browsing and admin management capabilities.

## Features

- **Public Dashboard**: Browse movies with advanced filtering, search, sorting, and pagination
- **Movie Details**: View comprehensive movie information including cast, synopsis, runtime, and ratings
- **Review System**: Users can read and write reviews with star ratings
- **Admin Panel**: Password-protected interface for managing movies (CRUD operations)
- **CSV Export**: Export filtered/sorted movies to CSV format
- **Responsive Design**: Mobile-friendly layouts for all screen sizes
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Data Storage**: JSON files (movies.json, reviews.json)
- **Authentication**: Simple password-based admin authentication

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd movie-dashboard
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

# Deployment Guide

## Vercel Deployment

This application is optimized for deployment on Vercel. Follow these steps to deploy:

### Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier available)

### Step 1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect your GitHub account and select the movie-dashboard repository
5. Click "Import"

### Step 2: Configure Environment Variables

1. In the Vercel project settings, go to "Environment Variables"
2. Add the following variable:

   - **Name**: `ADMIN_PASSWORD`
   - **Value**: Your secure admin password (not `admin123`)
   - **Environments**: Production, Preview, Development

3. Click "Save"

### Step 3: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your application will be live at the provided URL

### Step 4: Automatic Deployments

Once connected, every push to the `main` branch will automatically trigger a new deployment.

## API Endpoints

### Movies

- `GET /api/movies` - Fetch all movies with pagination, filtering, sorting, search
- `GET /api/movies/[id]` - Fetch single movie by ID
- `POST /api/movies` - Create new movie (admin only)
- `PUT /api/movies/[id]` - Update movie (admin only)
- `DELETE /api/movies/[id]` - Delete movie (admin only)
- `GET /api/movies/export/csv` - Export movies to CSV (admin only)

### Reviews

- `GET /api/reviews?movieId=[id]` - Fetch reviews for a movie
- `POST /api/reviews` - Create review for a movie
- `GET /api/reviews/[id]` - Fetch single review

### Authentication

- `POST /api/auth/login` - Admin login endpoint

## Admin Panel

### Access

- URL: `/admin`
- Default Password: `admin123`

### Features

- Add new movies with full details
- Edit existing movies
- Delete movies with confirmation
- Export all movies (or filtered) to CSV
- View all movies in a management table

### Environment Variables

Create a `.env.local` file:
Copy `.env.local.example` to `.env.local` and set ADMIN_PASSWORD

\`\`\`env

# Admin password for the dashboard

ADMIN_PASSWORD=admin123
\`\`\`

## Data Structures

### Movie

\`\`\`typescript
{
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
\`\`\`

### Review

\`\`\`typescript
{
id: number
movieId: number
userName: string
rating: number (1-5)
reviewText: string
createdAt: string (ISO 8601)
}
\`\`\`

## Features in Detail

### Dashboard

- **Search**: Search by movie title, director, or cast member
- **Genre Filter**: Filter movies by genre
- **Sorting**: Sort by rating, year, title, or review count
- **Pagination**: Configurable items per page (10, 20, 50)
- **Responsive Grid**: Adapts to different screen sizes

### Movie Detail Page

- Full movie information display
- Star rating visualization
- Cast and crew information
- Synopsis and runtime
- Review section with sorting options
- Review submission form with validation

### Admin Panel

- Secure login with password
- Add new movies with form validation
- Edit existing movies
- Delete movies with confirmation dialog
- CSV export with applied filters
- Responsive table layout

## CSV Export Format

The CSV export includes the following columns:

- ID
- Title
- Year
- Genre (comma-separated)
- Rating
- Director
- Runtime
- Cast (comma-separated)
- Review Count
- Average Rating

## Sample Data

The application comes with 20 sample movies and 10 sample reviews. You can:

- Add more movies through the admin panel
- Add reviews through the movie detail page
- Export all data to CSV

## Security Notes

- Admin password is stored in environment variables
- Authentication uses simple token-based system (suitable for internal tools)
- For production, consider implementing more robust authentication
- Row-level security should be implemented if using a database

## Performance Optimizations

- Image lazy loading on movie cards
- Pagination to limit data fetching
- Client-side filtering and sorting
- Responsive images with proper sizing
- Optimized bundle with Next.js
