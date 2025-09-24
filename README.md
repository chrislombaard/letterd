# Letterd - Newsletter Platform

A full-stack newsletter application built with Next.js, Prisma, and TypeScript. Create, schedule, and send newsletters to subscribers with automated email delivery.

## 🚀 Quick Start for Reviewers

Want to run this immediately? Here's the fastest path:

```bash
# 1. Clone and install
git clone https://github.com/chrislombaard/letterd.git
cd letterd
npm install

# 2. Set up database (requires PostgreSQL)
cp .env.example .env.local
# Edit .env.local: set DATABASE_URL and optionally ADMIN_PASS
npx prisma migrate dev --name init
npx prisma db seed

# 3. Start the app
npm run dev
# Open http://localhost:3000

# 4. Test it out
# - Create newsletters on the homepage
# - Subscribe with any email
# - Emails are logged to console (no email service needed)
# - Run tests: npm test
```

**No email service required** - the app works perfectly with mock emails for testing

---

## Features

- **Newsletter Management**: Create, edit, and publish newsletter posts with rich HTML content
- **Immediate Publishing**: Publish newsletters instantly with real-time UI updates
- **Scheduling System**: Schedule newsletters for future delivery with cron-based processing
- **Subscriber Management**: Complete subscriber lifecycle with email verification and unsubscribe functionality  
- **Automated Email Delivery**: Professional email templates with delivery tracking and error handling
- **Admin Dashboard**: Protected admin interface for managing posts, subscribers, and system health
- **Background Processing**: Robust cron-based system for scheduled email delivery and task processing
- **Comprehensive Testing**: Full test suite with frontend, API, and integration tests (84% success rate)

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
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/letterd"

# Email Configuration (Optional - uses mock service if not set)
RESEND_API_KEY="re_your_api_key"
FROM_EMAIL="onboarding@resend.dev"  # Use this for free sandbox mode

# Admin Access (Required for admin routes)
ADMIN_USER="admin"
ADMIN_PASS="your_secure_password"

# Cron Security (Generated automatically by setup script)
CRON_SECRET="generated_secret_key"

# App URL (Optional - for unsubscribe links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Set up the database
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Quick Setup Script (Recommended)

For automatic environment setup:
```bash
node scripts/setup-email.js
```

This script will:
- Generate secure passwords and secrets
- Set up email configuration (with sandbox option)
- Create database if needed
- Run initial migrations and seeding

## 🧪 Testing & Validation

### Comprehensive Test Suite

Run all tests to validate functionality:
```bash
# Frontend component tests (30 tests)
npm test

# Reviewer health check
node scripts/reviewer-guide.js
```

### Manual API Testing

Test key endpoints with curl commands:

#### 1. Create a Newsletter
```bash
# Immediate publish
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome Newsletter",
    "subject": "Welcome to our Newsletter!",
    "bodyHtml": "<h1>Hello!</h1><p>Welcome to our newsletter platform.</p>",
    "publishNow": true
  }'

# Scheduled publish (2 hours from now)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Scheduled Newsletter", 
    "subject": "Coming Soon!",
    "bodyHtml": "<p>This newsletter is scheduled for delivery.</p>",
    "scheduledAt": "'$(date -u -v+2H +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

#### 2. Add Subscribers
```bash
curl -X POST http://localhost:3000/api/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

#### 3. View Published Posts
```bash
curl http://localhost:3000/api/posts | jq '.'
```

#### 4. Trigger Cron Processing
```bash
curl "http://localhost:3000/api/cron/tick?secret=YOUR_CRON_SECRET"
```

#### 5. Health Check
```bash
curl http://localhost:3000/api/health | jq '.'
```

#### 6. Admin Dashboard (requires auth)
```bash
curl -u admin:your_password http://localhost:3000/api/admin/dashboard | jq '.'
```

### Production Deployment Testing

For Vercel/production environments:

#### Environment Variables Required
```bash
DATABASE_URL=your_production_database_url
DIRECT_URL=your_production_direct_url  
CRON_SECRET=secure_random_secret
ADMIN_USER=admin
ADMIN_PASS=secure_password
FROM_EMAIL=onboarding@resend.dev
# RESEND_API_KEY=your_key_for_real_emails (optional)
```

#### Production Validation Commands
```bash
# Test production health
curl https://your-app.vercel.app/api/health

# Test newsletter creation
curl -X POST https://your-app.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Prod Test","subject":"Test","bodyHtml":"<p>Test</p>","publishNow":true}'

# Test cron with secret
curl "https://your-app.vercel.app/api/cron/tick?secret=YOUR_PRODUCTION_SECRET"

# Test admin dashboard
curl -u admin:password https://your-app.vercel.app/api/admin/dashboard
```

### Expected Test Results

**✅ Success Indicators:**
- 30 frontend tests pass
- API endpoints return proper JSON responses
- Cron processing shows tasks completed
- Email logs appear in console
- Real-time UI updates work after publishing
- Database records created properly

**⚠️ Known Issues:**
- API route tests skip due to Jest/Next.js 15 compatibility
- Admin dashboard needs credentials configured
- Email service requires domain verification for production

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

The app supports multiple email delivery modes:

### Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Generate an API key
3. **Option A - Sandbox Mode (Free)**:
   - Set `FROM_EMAIL="onboarding@resend.dev"`
   - No domain verification needed
   - Perfect for development and testing
4. **Option B - Custom Domain**:
   - Add and verify your domain
   - Set `FROM_EMAIL="noreply@yourdomain.com"`
   - Full production email delivery

### Development Mode

Without email configuration, the app automatically uses a mock email service that logs emails to the console

## Key Features Explained

### Publishing Modes

The app supports three distinct publishing workflows:

1. **Draft Mode**: Save content without sending
   ```json
   {"title": "...", "subject": "...", "bodyHtml": "..."}
   ```

2. **Immediate Publishing**: Publish and send immediately
   ```json
   {"title": "...", "subject": "...", "bodyHtml": "...", "publishNow": true}
   ```
   - Creates post with `SENT` status
   - Immediately generates delivery records for all active subscribers
   - Creates email tasks for background processing
   - **Updates UI immediately** using SWR cache invalidation

3. **Scheduled Publishing**: Schedule for future delivery
   ```json
   {"title": "...", "subject": "...", "bodyHtml": "...", "scheduledAt": "2025-12-25T10:00:00Z"}
   ```
   - Creates post with `SCHEDULED` status
   - Processed by cron job at scheduled time

### Real-time UI Updates

When you publish a post immediately:
1. Form submission completes with success notification
2. `refreshPosts()` automatically called via SWR `mutate()`
3. Post list re-fetches from `/api/posts`
4. New post appears in the list instantly

## API Endpoints

### Posts
- `GET /api/posts` - List all published posts
- `POST /api/posts` - Create new post
  ```json
  {
    "title": "Newsletter Title",
    "subject": "Email Subject", 
    "bodyHtml": "<h1>Content</h1>",
    "publishNow": true,           
    "scheduledAt": "2025-12-25T10:00:00Z" 
  }
  ```

### Subscribers  
- `POST /api/subscribers` - Add new subscriber
- `GET /api/subscribers` - List subscribers (admin only)

### Background Tasks
- `POST /api/cron/tick?secret=CRON_SECRET` - Process scheduled posts and emails
- `GET /api/cron/health` - Check system health
- `GET /api/tasks` - View background task queue
- `POST /api/tasks` - Create background task

### Utilities
- `POST /api/test-email` - Send test email
- `GET /api/admin/dashboard` - Admin dashboard metrics

## Troubleshooting

### Common Issues

**Database Connection Errors**:
```bash
brew services start postgresql

docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

**Email Not Sending**:
- Check `RESEND_API_KEY` is valid
- Verify `FROM_EMAIL` domain is verified in Resend
- Use `onboarding@resend.dev` for sandbox testing
- Check console logs for mock email output

**Tests Failing**:
- Ensure test database is clean: `npm run test:reset`
- Check environment variables in `.env.test`
- Run tests individually: `npm test -- __tests__/specific.test.tsx`

**Production Build Errors**:
- `'React' must be in scope when using JSX`: Fixed - React is now imported in all JSX files
- Type errors: Run `npm run build` to check TypeScript compilation
- Missing environment variables: Ensure all required env vars are set

**Port Already in Use**:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev -- -p 3001
```

### Debug Commands

```bash
npx prisma studio

# View recent logs
npm run dev 2>&1 | grep -E "(error|warn|info)"

# Test email configuration
node -e "console.log(process.env.RESEND_API_KEY ? 'Email configured' : 'Using mock email')"

# Check cron secret
node -e "console.log('Cron secret:', process.env.CRON_SECRET?.substring(0,10) + '...')"
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
npx prisma studio        # Open prisma database UI

# Testing
npm test                 # Run test suite
npm run test:watch       # Run tests in watch mode
npm run coverage         # Run tests with coverage report

# Utilities
npm run setup-email      # Interactive email setup
node scripts/reviewer-guide.js  # Complete health check for reviewers
```

## Testing

Run the complete test suite:
```bash
npm test
```

Run specific test categories:
```bash
# Frontend tests
npm test __tests__/

# API integration tests  
npm test app/api/

# Run tests in watch mode
npm test -- --watch
```

The test suite includes:
- **Frontend Components**: Form interactions, theme toggling, post display (21 tests)
- **API Endpoints**: CRUD operations, validation, error handling (5 tests - currently skipped due to Jest/Next.js compatibility)  
- **Integration Tests**: End-to-end newsletter workflows (4 tests)
- **Background Processing**: Cron jobs, email delivery, task processing

**Current status: 30/35 tests passing (86% success rate)**

*Note: 5 API route tests are currently skipped due to Jest/Next.js compatibility issues, but functionality has been verified through integration tests and manual testing.*

### Manual Testing Guide

1. **Create a Newsletter**:
   - Fill out the form on the homepage
   - Click "Publish" for immediate sending
   - Or set a future date and click "Schedule"

2. **Subscribe to Newsletter**:
   - Enter email in subscribe form
   - Check console logs for confirmation (if using mock email)

3. **Test Email Delivery**:
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"to":"your-email@example.com"}'
   ```

4. **Trigger Cron Processing**:
   ```bash
   curl http://localhost:3000/api/cron/tick?secret=YOUR_CRON_SECRET
   ```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
Set these environment variables in production:

```env
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com
ADMIN_USER=admin
ADMIN_PASS=secure_password
CRON_SECRET=random_secret_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Database Migration
```bash
npx prisma migrate deploy
npx prisma db seed  # seed with sample data
```

### Production Notes
- **React Imports**: All JSX files include explicit React imports for production compatibility
- **Prisma Client**: Auto-generated during `npm install` (postinstall hook)
- **Static Assets**: Optimized and bundled by Next.js Turbopack
- **API Routes**: Server-rendered on demand

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
