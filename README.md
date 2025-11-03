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

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd movie-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD` - Your admin password
4. Deploy

The application will automatically deploy on every push to the main branch.

## Development

### Running Tests

\`\`\`bash
npm run test
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Code Quality

\`\`\`bash
npm run lint
\`\`\`

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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

## Future Enhancements

- User authentication system
- Database integration (PostgreSQL/MongoDB)
- Advanced search with filters
- Movie recommendations
- User watchlist
- Social features (likes, follows)
- Admin analytics dashboard
- Email notifications
- API rate limiting
