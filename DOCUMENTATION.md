# Pre-Post Documentation

**"Say It While They Can Hear It"**

Pre-Post is an anonymous messaging platform that lets people write heartfelt messages to those they care about -- before it's too late. The core philosophy is "say it pre, not post," encouraging people to share meaningful words while recipients can still hear them, rather than saving them for eulogies.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [Authentication System](#authentication-system)
5. [Core Features](#core-features)
6. [Credit System](#credit-system)
7. [Email System](#email-system)
8. [Content Moderation](#content-moderation)
9. [Admin System](#admin-system)
10. [API Reference](#api-reference)
11. [Middleware & Route Protection](#middleware--route-protection)
12. [UI Components](#ui-components)
13. [Styling & Theming](#styling--theming)
14. [Security](#security)
15. [Cron Jobs](#cron-jobs)
16. [Environment Variables](#environment-variables)
17. [Development & Deployment](#development--deployment)
18. [Design Principles](#design-principles)

---

## Tech Stack

| Layer          | Technology               |
| -------------- | ------------------------ |
| Frontend       | Next.js + React 18       |
| Backend        | Next.js API Routes       |
| Database       | PostgreSQL               |
| ORM            | Prisma                   |
| Authentication | Jose JWT + Magic Links   |
| Email          | Resend                   |
| Styling        | Tailwind CSS             |
| Hosting        | Vercel                   |
| Analytics      | Google Analytics          |

---

## Project Structure

```
/src
  /app
    /admin
      page.tsx                    # Admin dashboard
      /users
        page.tsx                  # All users list
    /api
      /auth
        /login/route.ts           # Magic link request
        /verify/route.ts          # Token validation
        /logout/route.ts          # Session clear
      /messages
        route.ts                  # POST: send message
        /[id]/route.ts            # GET: read, DELETE: soft-delete
      /admin
        route.ts                  # GET: stats, POST: actions
        /users/route.ts           # GET: all users
      /reports
        route.ts                  # POST: report message
      /cron
        /reminder-emails/route.ts # Reminder email cron job
    /dashboard/page.tsx           # Main user hub
    /write/page.tsx               # Compose a message
    /inbox/page.tsx               # Received messages
    /sent/page.tsx                # Sent messages
    /message/[id]/page.tsx        # View individual message
    /login/page.tsx               # Login form
    /verify/page.tsx              # Magic link verification
    /why/page.tsx                 # Philosophy & FAQs
    /how/page.tsx                 # Writing guide & tips
    /privacy/page.tsx             # Privacy policy
    layout.tsx                    # Root layout (GA, theme script)
    page.tsx                      # Home / landing page
    globals.css                   # Base styles
  /components
    Header.tsx                    # Navigation bar
    MessageForm.tsx               # Message composition form
    MessageCard.tsx               # Message display in lists
    OnboardingModal.tsx           # First-time user intro
    SuccessMessage.tsx            # Post-send confirmation
    Pagination.tsx                # Paginated list controls
    CreditBadge.tsx               # Credit count display
    ThemeToggle.tsx               # Light/dark mode switch
  /lib
    auth.ts                       # JWT sessions & user helpers
    db.ts                         # Prisma client singleton
    email.ts                      # Resend email integration
    credits.ts                    # Credit award/spend logic
    content-filter.ts             # Profanity/hate speech filter
  middleware.ts                   # Route protection
/prisma
  schema.prisma                   # Database models
```

---

## Database Schema

Four models defined in `prisma/schema.prisma`:

### User

| Field       | Type      | Notes                           |
| ----------- | --------- | ------------------------------- |
| id          | UUID      | Primary key                     |
| email       | String    | Unique, required                |
| name        | String?   | Optional display name           |
| credits     | Int       | Default: 0, balance for reading |
| suspended   | Boolean   | Default: false                  |
| createdAt   | DateTime  | Auto-set                        |

Relations: sentMessages, receivedMessages, magicLinks, reports

### Message

| Field          | Type      | Notes                                   |
| -------------- | --------- | --------------------------------------- |
| id             | UUID      | Primary key                             |
| senderId       | UUID      | Foreign key to User                     |
| recipientEmail | String    | Can be a non-registered user            |
| recipientName  | String    | Name provided by sender                 |
| recipientId    | UUID?     | Set when recipient registers            |
| content        | String    | Message text                            |
| isRead         | Boolean   | Default: false                          |
| isDeleted      | Boolean   | Default: false (soft delete)            |
| createdAt      | DateTime  | Auto-set                                |
| readAt         | DateTime? | Set on first read                       |
| deletedAt      | DateTime? | Set on soft delete                      |
| reminderSentAt | DateTime? | Set when reminder email sent            |

Constraint: One message per sender-recipient pair (unique composite on senderId + recipientEmail).

### MagicLink

| Field     | Type     | Notes                    |
| --------- | -------- | ------------------------ |
| id        | UUID     | Primary key              |
| email     | String   | Recipient email          |
| token     | String   | Unique, 32-byte hex      |
| expiresAt | DateTime | 15-minute window         |
| used      | Boolean  | Default: false           |
| userId    | UUID?    | Linked after first login |

### Report

| Field      | Type     | Notes                                |
| ---------- | -------- | ------------------------------------ |
| id         | UUID     | Primary key                          |
| messageId  | UUID     | Foreign key to Message               |
| reporterId | UUID     | Foreign key to User                  |
| reason     | String   | User-provided reason                 |
| status     | String   | "pending", "reviewed", or "dismissed"|
| createdAt  | DateTime | Auto-set                             |
| reviewedAt | DateTime?| Set when admin reviews               |

---

## Authentication System

Pre-Post uses **passwordless magic link authentication** -- no passwords are ever stored.

### Login Flow

1. User enters their email on `/login`
2. `POST /api/auth/login` generates a 32-byte random token, stores a `MagicLink` record with a 15-minute expiry
3. An email is sent via Resend containing a `/verify?token=...` link
4. User clicks the link, hitting `GET /api/auth/verify`
5. The token is validated and marked as used
6. If the user is new, an account is created and a welcome email is sent
7. Any messages previously sent to that email address are linked to the new account
8. A session JWT (HS256, 30-day expiry) is set as an httpOnly cookie named `session`

### Auth Helpers (`lib/auth.ts`)

- `getCurrentUser()` -- returns the authenticated user or null
- `requireAuth()` -- throws if not authenticated or if the user is suspended
- `isAdmin()` -- checks if the user's email is in the `ADMIN_EMAILS` env var

### Anti-Bot Protection

- A hidden honeypot "company" field on the login form catches automated submissions

---

## Core Features

### Writing Messages (`/write`)

Users compose anonymous messages through the `MessageForm` component.

- **Fields:** recipient name, recipient email, message content
- **Constraints:**
  - One message per recipient (enforced at the database level)
  - Messages are permanent -- no editing or deleting by the sender
  - Content is filtered for profanity and hate speech (client-side and server-side)
- **On send:** the sender earns +1 credit
- **Recipients don't need an account** -- they receive an email notification and can sign up to read

### Inbox (`/inbox`)

Lists all received messages with pagination (20 per page).

- Unread count displayed prominently
- Visual lock icon shown when no credits are available to read
- Relative timestamps ("2 hours ago")
- Read vs unread visual distinction

### Reading a Message (`/message/[id]`)

- Only the recipient (or sender for verification) can view
- First read costs 1 credit and marks the message as read
- Re-reading already-read messages is free
- Shows an anonymity notice ("The sender chose to remain anonymous")
- Options to report or delete the message
- CTA to "pay it forward" by writing a message to someone else

### Sent Messages (`/sent`)

Shows all messages the user has sent, paginated.

- Message numbering in `PP 001` format
- Recipient name and email visible
- Message preview (first 120 characters)
- Read status indicator (green "Read by recipient" / gray "Not yet read")
- Sent date

### Dashboard (`/dashboard`)

The main hub after login.

- Personalized welcome message
- Onboarding modal for first-time users
- "Getting started" prompt if the user has no credits and no sent messages
- Three stat cards:
  - Unread messages (links to inbox)
  - Read messages (links to inbox)
  - Sent messages (links to sent)
- Primary CTA to write a message, showing current credit count

### Static Pages

- **`/why`** -- the philosophy behind Pre-Post, FAQs about anonymity, credits, and privacy
- **`/how`** -- writing tips, prompts, and guidance for composing meaningful messages
- **`/privacy`** -- comprehensive privacy policy
- **`/` (home)** -- landing page with hero section, how-it-works steps, promises, and CTA

---

## Credit System

The credit system implements a "pay it forward" model:

| Action                  | Credits |
| ----------------------- | ------- |
| Send a message          | +1      |
| Read an unread message  | -1      |
| Re-read a read message  | Free    |

### Implementation (`lib/credits.ts`)

- `awardCredit(userId)` -- increments user's credit count by 1
- `spendCredit(userId)` -- decrements by 1; returns false if insufficient
- `getCredits(userId)` -- returns current balance

If a user tries to read an unread message without credits, the API returns `402 Payment Required`. The UI shows a lock icon and guides them to write a message first.

---

## Email System

All emails are sent via **Resend** (`lib/email.ts`) with HTML + plain text templates.

### Email Types

| Email              | Trigger                          | Subject                                            |
| ------------------ | -------------------------------- | -------------------------------------------------- |
| Magic Link (new)   | New user login request           | "Welcome to Pre-Post"                              |
| Magic Link (existing) | Returning user login request  | "Your login link"                                  |
| New Message        | Someone sends a message          | "You have a new message on Pre-Post"               |
| Reminder           | 7+ days unread (cron)            | "Reminder: Someone wrote something for you"        |
| Welcome            | First account creation           | "Welcome to Pre-Post"                              |

### Email Details

- **Magic Link emails** include a verification link (15-minute expiry) and explain the pay-it-forward model
- **New Message notifications** tell the recipient someone wrote for them without revealing the sender
- **Reminder emails** are a gentle nudge sent once, 7+ days after delivery, if the message is still unread
- **Welcome emails** explain the credit system and encourage writing a first message

---

## Content Moderation

### Automated Filtering (`lib/content-filter.ts`)

A regex-based filter catches profanity, slurs, and hate speech. It detects:

- 18 core blocked words/phrases
- Leetspeak evasion attempts (e.g., `@` for `a`, `3` for `e`, `0` for `o`)
- Applied to both message content and recipient names
- Runs on both client-side (form validation) and server-side (API validation)

### User Reporting

- Recipients can report messages via `POST /api/reports`
- One report per user per message
- Reports include a reason and capture the message content
- Reports go to the admin dashboard for review

### Admin Actions

- **Dismiss report** -- marks it as reviewed with no action
- **Suspend sender** -- bans the user from the platform; marks the report as reviewed
- Suspended users cannot log in, send, or receive messages
- Admins can unsuspend users

---

## Admin System

### Access Control

Only users whose email appears in the `ADMIN_EMAILS` environment variable can access admin pages and API endpoints.

### Admin Dashboard (`/admin`)

Displays a grid of 12 stat cards:

| Card                | Description                           |
| ------------------- | ------------------------------------- |
| Total Users         | All registered users                  |
| Total Messages      | All messages sent                     |
| Unread Messages     | Messages not yet read                 |
| Pending Reports     | Reports awaiting review               |
| Users Today         | Registrations in the last 24 hours    |
| Messages Today      | Messages sent in the last 24 hours    |
| Read Rate           | Percentage of messages that are read  |
| Suspended Users     | Currently suspended accounts          |
| Total Credits       | Sum of all user credit balances       |
| Reminders Sent      | Total reminder emails sent            |
| Pending Reminders   | Unread messages not yet reminded      |
| Deleted Messages    | Soft-deleted message count            |

Below the stats:

- **Pending Reports** -- each report shows reporter email, sender email, reason, full message content, and action buttons (Suspend Sender / Dismiss)
- **Recent Users** -- last 10 registrations with email, credits, sent/received counts, status, and suspend/unsuspend toggle
- **Recent Messages** -- last 10 messages with sender, recipient, read status, and date

### Admin Users Page (`/admin/users`)

Full list of all users with the same details and actions as the dashboard table.

### Performance

Admin API queries are batched to avoid database connection pool exhaustion (22 queries split across multiple batches).

---

## API Reference

### Authentication

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| POST   | `/api/auth/login`   | Send magic link email           |
| GET    | `/api/auth/verify`  | Verify token, create session    |
| POST   | `/api/auth/logout`  | Clear session cookie            |

### Messages

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| POST   | `/api/messages`       | Send a new message (+1 credit)     |
| GET    | `/api/messages/[id]`  | Read a message (-1 credit if new)  |
| DELETE | `/api/messages/[id]`  | Soft-delete a message              |

### Reports

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| POST   | `/api/reports`  | Report a message     |

### Admin

| Method | Endpoint            | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/api/admin`        | Fetch dashboard stats, reports, users    |
| POST   | `/api/admin`        | Suspend/unsuspend user, handle reports   |
| GET    | `/api/admin/users`  | List all users                           |

### Cron

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/cron/reminder-emails`  | Send 7-day reminder emails   |

---

## Middleware & Route Protection

Defined in `src/middleware.ts`.

### Protected Routes (require authentication)

`/dashboard`, `/write`, `/inbox`, `/message`, `/sent`

Unauthenticated users are redirected to `/login?redirect=[original-path]`.

### Auth Routes (redirect if already logged in)

`/login`, `/verify`

Authenticated users are redirected to `/dashboard`.

---

## UI Components

| Component          | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `Header`           | Top navigation bar with links, user info, logout, admin link, theme toggle |
| `MessageForm`      | Client-side form for composing messages with validation  |
| `MessageCard`      | Displays a message in list views (inbox, sent)           |
| `OnboardingModal`  | Welcome modal for first-time users explaining the platform |
| `SuccessMessage`   | Confirmation screen after sending a message              |
| `Pagination`       | Previous/next controls for paginated lists               |
| `CreditBadge`      | Shows the user's current credit count                    |
| `ThemeToggle`      | Switches between light and dark mode                     |

---

## Styling & Theming

### Tailwind CSS

All styling uses Tailwind CSS utility classes with a mobile-first responsive design.

### Color Palette

- **Brand color (light):** `#DDE3D5` (pale sage green)
- **Brand color (dark):** `#3a4a2f` (dark green)
- **Status colors:** Red (unread/urgent), Green (active/read), Orange (warning), Blue (info)

### Dark Mode

- Implemented via Tailwind's `darkMode: 'class'` strategy
- Preference persisted in `localStorage`
- Inline script in `<head>` prevents flash of wrong theme on load
- Toggled via the `ThemeToggle` component

### Typography

- **Font:** Geist Sans (locally hosted custom font)
- **Approach:** Clean, minimal, mobile-first

---

## Security

### Authentication & Sessions

- Passwordless (no password storage, no password-related vulnerabilities)
- JWT signed with HS256 using `AUTH_SECRET`
- HTTPOnly cookies (inaccessible to client-side JavaScript)
- 30-day session expiry
- Magic link tokens are single-use and expire after 15 minutes

### Message Privacy

- Sender identity is never revealed to the recipient
- Only the sender and recipient can access a message
- Admins can only see message content when it has been reported
- Soft deletes maintain an audit trail

### Abuse Prevention

- One message per sender-recipient pair (prevents spam)
- Honeypot field on login (catches bots)
- Rate limiting on magic links (prevents abuse of email sending)
- User suspension system for bad actors
- Automated content filtering with leetspeak detection

---

## Cron Jobs

### Reminder Emails

- **Schedule:** Daily at 14:00 UTC (configured in `vercel.json`)
- **Endpoint:** `GET /api/cron/reminder-emails`
- **Auth:** Bearer token via `CRON_SECRET` environment variable
- **Logic:**
  1. Find all messages that are unread for 7+ days
  2. Exclude messages that have already received a reminder or are deleted
  3. Send a reminder email to each recipient
  4. Mark the message with a `reminderSentAt` timestamp
- **Frequency:** Each message gets at most one reminder

---

## Environment Variables

| Variable               | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string                 |
| `AUTH_SECRET`          | Secret key for JWT signing                   |
| `RESEND_API_KEY`       | API key for Resend email service             |
| `NEXT_PUBLIC_APP_URL`  | Public app URL (used in email links)         |
| `ADMIN_EMAILS`         | Comma-separated list of admin email addresses|
| `CRON_SECRET`          | Bearer token to authenticate cron requests   |

---

## Development & Deployment

### Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # prisma generate && prisma db push && next build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Development Mode

- If `RESEND_API_KEY` is not set, magic link tokens are logged to the console
- Dev magic link is also returned in the login API response for convenience

### Deployment

- **Platform:** Vercel
- **Build:** `prisma generate && prisma db push && next build`
- **Cron:** Configured in `vercel.json` for daily reminder emails
- **Node:** Requires >= 18.0.0

---

## Design Principles

1. **Anonymity First** -- Sender identity is never revealed. The focus is on the message's impact, not who wrote it.

2. **Intentionality** -- One message per person. This constraint forces senders to compose something meaningful rather than sending casual messages.

3. **Permanence** -- Messages cannot be edited or deleted by the sender. This makes every word count and gives the message weight.

4. **Simplicity** -- Text-only, mobile-first UI. No images, no rich media, no distractions. Just words.

5. **Pay It Forward** -- The credit system ensures that to receive, you must first give. This creates a cycle of meaningful expression.

6. **Privacy** -- Admins cannot read messages unless they are reported. The platform respects the intimate nature of these communications.

7. **Moderation** -- Community-driven reporting with admin review keeps the platform safe while maintaining trust.
