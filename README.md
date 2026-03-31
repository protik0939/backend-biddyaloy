# Biddyaloy Backend

Backend API for the Biddyaloy educational management platform.

This service provides authentication, institution onboarding, academic management workflows, role-based access control, payments, notices, and teacher/student portal operations.

## Tech Stack

- Node.js (ESM)
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL (`pg` + Prisma adapter)
- Better Auth
- Zod for request validation
- Nodemailer for email/OTP/reset flows

## Core Capabilities

### Authentication and Access

- Better Auth integration mounted under `/api/auth/*`
- Session-aware, role-based route protections
- OTP verification flow for pending accounts
- Password flows (forgot/reset/change)
- Account status gates (including pending and subscription-expired behavior)

### Institution and Admin Flows

- Institution application submission and super-admin review
- Institution approval/rejection workflows
- Institution admin sub-admin provisioning (faculty/department admin variants)
- Institution-level payment gateway credential management

### Academic Domain

- Faculty, department/program, semester/session, batch/class, section, course management
- Course-teacher assignment and course registration workflows
- Routine, schedule, and classroom support
- Department transfer workflows for students/teachers

### Teacher Portal

- Teacher application profile and apply workflows
- Section and student visibility
- Classwork CRUD (`TASK`, `ASSIGNMENT`, `QUIZ`, `NOTICE`)
- Attendance upsert and retrieval
- Marks entry with lab/non-lab validation rules

### Student Portal

- Student admission profile and apply workflows
- Timeline, submissions, result, and fee status endpoints
- Student fee payment initiation and callback handling

### Notices and Posts

- Notice center with role-targeted recipients
- Read/unread tracking and unread count endpoints
- Posting and public listing support for applications

## Main API Route Prefixes

- `/api/auth/*` - Better Auth handler
- `/api/v1/auth` - custom auth helpers (OTP, password, leave flow)
- `/api/v1/classrooms`
- `/api/v1/department`
- `/api/v1/faculty`
- `/api/v1/institute`
- `/api/v1/institution-applications`
- `/api/v1/institution-admin`
- `/api/v1/notices`
- `/api/v1/postings`
- `/api/v1/routines`
- `/api/v1/teacher`

## Project Structure

```text
backend-biddyaloy/
  src/
    app/
      controllers/
      routes/
      services/
      middlewares/
      lib/
      validations/
    app.ts
    server.ts
  prisma/
    schema/
    migrations/
  api/
```

## Environment Variables

Create `.env` from `.env.example` and update values.

```env
DATABASE_URL=
BACKEND_PUBLIC_URL=https://your-backend-domain.vercel.app
FRONTEND_PUBLIC_URL=https://your-frontend-domain.vercel.app
FRONTEND_PREVIEW_URL_PATTERN=
FRONTEND_ALLOWED_ORIGINS=
AUTH_SECRET=
NODE_ENV=production
SUPER_ADMIN_NAME=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASS=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM="Biddyaloy <your-email@gmail.com>"
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_BASE_URL=https://sandbox.sslcommerz.com
```

Important:

- `AUTH_SECRET` must match frontend configuration.
- CORS/trusted origins rely on `FRONTEND_PUBLIC_URL` and optional preview/extra origin settings.
- Payment callbacks require publicly reachable backend URL paths.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set PostgreSQL and other required values.

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Start backend in watch mode

```bash
npm run dev
```

Default local URL:

- `http://localhost:5000`

## NPM Scripts

- `npm run dev` - Start backend in watch mode via `tsx`
- `npm run build` - Generate Prisma client and build deploy bundle with `tsup`
- `npm run start` - Start compiled server output
- `npm run seed:superAdmin` - Run super admin seed script in watch mode

## Build and Deployment Notes

- Deployment flow is aligned with Vercel-style API output under `api/`.
- Ensure Prisma client generation is included in build (`npm run build`).
- Keep runtime env values configured in deployment platform.
- Verify callback endpoints for institution subscription and student fee payment are publicly reachable.

## Operational Considerations

- Use PostgreSQL enum and migration naming carefully when evolving Prisma schema.
- Keep auth/CORS environment contract synchronized with frontend.
- For teacher/student workflows, ensure profile completeness checks are preserved to avoid invalid application state.

## Health and Troubleshooting

If API routes fail locally:

1. Confirm `DATABASE_URL` is valid and reachable.
2. Regenerate Prisma client (`npx prisma generate`).
3. Re-run migrations if schema drift is detected.
4. Verify CORS and frontend origin variables.
5. Check payment/email credentials if related flows fail.

## License

This project is currently private/internal. Add or update licensing terms as needed.
