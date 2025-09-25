# Letterd - Newsletter Platform

Click here to view the production site - https://letterd.vercel.app/

A full-stack newsletter application take-home submission - built with Next.js, Prisma, and TypeScript. Create, schedule, and send newsletters to subscribers with automated email delivery. Not the prettiest, but I ran out of time to polish the UI as much as I liked. I initially made the email service work with a mock, but decided last minute to add Sendgrid using a personally autheticated email (included in the free plan, so I didn't need to register or buy a new domain). Frontend is built with Mantine, I didn't spend as much time as I would have liked on the CSS, so there are patterns that I would have liked to refactor and simplify.

## Quick Start

```bash
# 1. Clone, and install repo locally
git clone https://github.com/chrislombaard/letterd.git
cd letterd
npm install

# 2. Set up prisma database, create env var files

cp .env.example .env.local

npx prisma migrate dev --name init
npx prisma db seed

# 3. Run the app in dev mode
npm run dev
# Navigate to http://localhost:3000

# 4. Run the test suites with jest
npm test
```

## Features

- **Newsletter Creation**: Rich HTML newsletters with instant or scheduled publishing
- **Subscriber Management**: You can subscribe to the newsletter (but unsubscribe is not implemented)
- **Email Delivery**: Automated background processing with delivery tracking. Cron job using github actions to process the scheduled deliveries. (Room for optimisation here)
- **Admin Dashboard**: Protected interface for system monitoring (view stats on subscribers, posts, scheduled posts etc)
- **Real-time UI**: Live updates when newsletters are published, using `mutate` from `swr` to grab the latest posts
- **Comprehensive Testing**: 34 tests covering frontend, API, and integration workflows

## Technology Stack Choices

**Next.js 15 with App Router**: Needed full-stack capabilities in one framework. App Router provides modern React patterns with built-in API routes, eliminating the need for a separate backend service.

**Prisma + PostgreSQL**: Required type-safe database access with good developer experience. PostgreSQL handles the relational structure (posts, subscribers, deliveries) better than NoSQL. Never used Prisma before - turned out to be much easier than traditional ORMs.

**Custom Background Processing**: Built simple cron-based task queue instead of Redis/external services to keep infrastructure minimal while maintaining full control over email delivery logic.

**Sendgrid for Email**: Developer-friendly API with good deliverability rates. Supports sandbox mode for free testing without domain verification.

**React Testing Library + Jest**: Comprehensive testing strategy covering user interactions, API endpoints, and end-to-end workflows. 34 tests provide confidence in core functionality.

## Key Trade-offs Made

**Custom Task Queue vs External Service**: Built in-process task handling instead of using Redis/SQS. This limits horizontal scaling but reduces infrastructure complexity and keeps costs low for smaller deployments.

**Single Database vs Microservices**: Used one PostgreSQL database for all data instead of separate services for posts/subscribers/delivery. Simpler to deploy and debug, but creates coupling between domains.

**Mock Email Service**: Development mode uses console logging instead of requiring email configuration. Great for testing but means reviewers can't see real email delivery without setup.

**Basic Auth vs OAuth**: Used simple username/password for admin routes instead of full OAuth implementation. Faster to build but less secure for production use.

**Cron-based Scheduling**: External cron job triggers scheduled email processing instead of internal scheduling. Requires external setup but works reliably across deployment platforms.

These trade-offs prioritize simplicity and fast development while maintaining core functionality. Acceptable for MVP and small-scale deployments.

## Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Prisma account
- Vercel account
- Sendgrid account (optional)

### Environment Configuration

```env
# Required
DATABASE_URL="postgresql://username:password@localhost:5432/letterd"
DIRECT_URL="postgresql://username:password@localhost:5432/letterd"

ADMIN_USER="admin"
ADMIN_PASS="your_secure_password"
CRON_SECRET="generated_secret_key"

FROM_EMAIL="onboarding@letterd.dev"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Quick Setup Script

### Core Operations

```bash
# Create newsletter (immediate)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","subject":"Test","bodyHtml":"<p>Test</p>","publishNow":true}'

# Create newsletter (scheduled)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Future","subject":"Later","bodyHtml":"<p>Later</p>","scheduledAt":"2025-12-25T10:00:00Z"}'

# Add subscriber
curl -X POST http://localhost:3000/api/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Trigger cron processing
curl "http://localhost:3000/api/cron/tick?secret=YOUR_CRON_SECRET"

curl http://localhost:3000/api/health
```

## Testing

```bash
npm test
npm test -- --watch
npm run coverage
```

Test coverage includes:

- Frontend components and user interactions
- API route validation and error handling
- End-to-end newsletter publishing workflows
- Background task processing and email delivery

**Status: 34/34 tests passing** (API route tests work via integration tests due to Jest/Next.js compatibility issues)

### Production Considerations

- **Database**: Lean more into Prisma Accelerate for better query execution speed and reliability.
- **Email Service**: Verify domain to use in production not personal email
- **Cron Jobs**: Use a more robust setup like Redis Queue, or AWS MQS, or rabbitmq
- **Monitoring**: Set up alerts for failed deliveries and stuck tasks
- **Security**: Use strong passwords, secure secrets, and HTTPS only.

### Deployment Platforms

- Deploy directly from GitHub with Vercel, building on this could use AWS, or GCP MIG, serverless stack or terraform

## Future Improvements

Given more time, these improvements would be prioritized:

### Short-term (1-2 weeks)

- Worker locking to prevent race conditions in email delivery
- Circuit breaker pattern for email service reliability
- Enhanced monitoring dashboard with delivery metrics
- Dead letter queue for failed email deliveries

### Medium-term (1-2 months)

- Horizontal scaling support with stateless workers
- Advanced retry strategies with exponential backoff
- Email template editor with drag-and-drop interface
- Webhook support for delivery notifications

### Long-term (3+ months)

- Multi-tenant support for multiple newsletters
- Advanced analytics and subscriber management
- API rate limiting and usage monitoring

**When to add them**: Immediate needs first (worker locking), then operational improvements as user base grows. UI enhancements can wait until core reliability is proven.

## Database Schema

Five main tables handle the newsletter system:

- **Post**: Newsletter content and scheduling
- **Subscriber**: Email addresses and subscription status
- **Delivery**: Tracks which emails were sent to which people
- **Task**: Background job queue for email processing
- **CronExecution**: Prevents duplicate cron job execution

```
letterd/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── (server)/          # Server-side utilities
│   └── *.tsx              # Pages and components
├── lib/                   # Shared utilities
├── db/                    # Database schema and migrations
├── components/            # React components (with co-located tests)
└── scripts/               # Setup scripts
```

## Key Features Explained

### Publishing Modes

The app supports three distinct publishing workflows:

1. **Draft Mode**: Save content without sending

   ```json
   { "title": "...", "subject": "...", "bodyHtml": "..." }
   ```

2. **Immediate Publishing**: Publish and send immediately

   ```json
   { "title": "...", "subject": "...", "bodyHtml": "...", "publishNow": true }
   ```

   - Creates post with `SENT` status
   - Immediately generates delivery records for all active subscribers
   - Creates email tasks for background processing
   - **Updates UI immediately** using SWR cache invalidation

3. **Scheduled Publishing**: Schedule for future delivery

   ```json
   {
     "title": "...",
     "subject": "...",
     "bodyHtml": "...",
     "scheduledAt": "2025-12-25T10:00:00Z"
   }
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

- `GET /api/admin/dashboard` - Admin dashboard metrics

## Troubleshooting

### Common Issues

**Email Not Sending**:

- Check `SENDGRID_API_KEY` is valid
- Verify `FROM_EMAIL` domain is verified in Sendgrid
- Check console logs on Vercel deployment logs for more info

**Tests Failing**:

- Check mock import order
- Have you mocked the correct dependencies?
- Check environment variables are correct
- Run tests individually: `npm test -- path/to/specific.test.tsx`

**Production Build Errors**:

- `'React' must be in scope when using JSX`: Fixed - React is now imported in all JSX files
- Type errors: Run `npm run build` to check TypeScript compilation
- Missing environment variables: Ensure all required env vars are set

# Utilities

The test suite includes:

- **Frontend Components**: Form interactions, theme toggling, post display
- **API Endpoints**: CRUD operations, validation, error handling
- **Integration Tests**: End-to-end newsletter workflows
- **Background Processing**: Cron jobs, email delivery, task processing

Something to add for future - Cypress e2e tests

### Manual Testing Guide

1. **Create a Newsletter**:
   - Fill out the form on the homepage
   - Click "Publish" for immediate sending
   - Or set a future date and click "Schedule"

2. **Subscribe to Newsletter**:
   - Enter email in subscribe form
   - Check console logs for confirmation (if using mock email)
