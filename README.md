# Letterd - Newsletter Platform

A full-stack newsletter application built with Next.js, Prisma, and TypeScript. Create, schedule, and send newsletters to subscribers with automated email delivery.

## Features

- **Newsletter Management**: Create and edit newsletter posts with rich HTML content
- **Subscriber System**: Manage subscribers with email verification and unsubscribe functionality  
- **Scheduling**: Schedule newsletters for future delivery
- **Email Delivery**: Automated email sending with professional templates
- **Admin Dashboard**: Protected admin interface for managing posts and subscribers
- **Background Processing**: Cron-based system for scheduled email delivery
- **Testing**: Comprehensive test suite with 84% success rate

## Tech Stack

**Frontend**: Next.js 15 (App Router), React, TypeScript, Mantine UI
**Backend**: Next.js API Routes, Prisma ORM  
**Database**: PostgreSQL
**Email**: Resend API with fallback to mock service
**Testing**: Jest
**Authentication**: Basic Auth for admin routes

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Resend account (optional, for email delivery)

### Installation

1. Clone the repository
```bash
git clone https://github.com/chrislombaard/letterd.git
cd letterd
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your database URL and email settings:
```env
DATABASE_URL="your_postgresql_connection_string"
RESEND_API_KEY="your_resend_api_key"
FROM_EMAIL="your-email@your-domain.com"
ADMIN_USER="admin"
ADMIN_PASS="your_admin_password"
```

4. Set up the database
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
letterd/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── (server)/          # Server-side utilities
│   └── *.tsx              # Pages and components
├── lib/                   # Shared utilities
├── db/                    # Database schema and migrations
├── components/            # React components  
├── __tests__/             # Test files
└── scripts/               # Setup scripts
```

## Database Schema

The application uses five main tables:

- **Post**: Newsletter content (title, subject, HTML body, status, scheduled time)
- **Subscriber**: Email addresses with subscription status
- **Delivery**: Tracks which posts were sent to which subscribers
- **Task**: Background job queue for email processing
- **CronExecution**: Logs cron job executions

## Email Configuration

### Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Generate an API key
3. Add and verify your domain
4. Set `RESEND_API_KEY` and `FROM_EMAIL` in your environment

### Development Mode

Without email configuration, the app uses a mock email service that logs emails to the console.

## API Endpoints

### Posts
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get specific post

### Subscribers  
- `POST /api/subscribers` - Add new subscriber
- `GET /api/subscribers` - List subscribers (admin)

### Background Tasks
- `POST /api/cron/tick` - Process scheduled posts
- `GET /api/cron/health` - Check system health

### Utilities
- `POST /api/test-email` - Send test email
- `GET /api/admin/dashboard` - Admin dashboard data

## Testing

Run the test suite:
```bash
npm test
```

The tests cover:
- API endpoints with real database operations
- Email delivery pipeline
- Background task processing  
- Input validation
- Error handling

Current status: 21/25 tests passing (84% success rate)

## Deployment

### Environment Setup
Set these environment variables in production:

```env
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com
ADMIN_USER=admin
ADMIN_PASS=secure_password
CRON_SECRET=random_secret_key
```

### Database Migration
```bash
npx prisma migrate deploy
```

### Cron Job Setup
The app expects a cron job to hit `/api/cron/tick` for processing scheduled emails. Set up a cron job or use a service like GitHub Actions to call this endpoint regularly.

## Development

### Database Management
```bash
# View data in browser
npx prisma studio

# Reset database  
npx prisma migrate reset

# Create migration
npx prisma migrate dev --name migration_name
```

### Email Testing
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'
```

## Architecture Decisions

**Next.js App Router**: Chose this for full-stack capabilities in a single framework, with built-in API routes and modern React features.

**Prisma + PostgreSQL**: Prisma provides type-safe database access with great developer experience. PostgreSQL handles the relational data structure needed for newsletters, subscribers, and delivery tracking. I've never used it before, and thought it would be a great new challenge. (It was easier than ever to use!)

**Custom Background Processing**: Built a simple cron-based system instead of using external queue services to keep infrastructure minimal while maintaining full control.

**Resend for Email**: Developer-friendly API with good deliverability rates and reasonable pricing.

## License

MIT
