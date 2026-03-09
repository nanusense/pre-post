# Pre-Post -- A One-Page Overview

**"Say It While They Can Hear It"**

---

## The Idea

We all have things we've never said -- to parents, friends, partners, mentors. Words we meant to say but kept putting off. And when someone passes away, tribute pages overflow with beautiful messages they never got to read.

Pre-Post flips that around. It's a platform where you can write an anonymous message to someone you care about and have it delivered to them *now*, while they're still here. No sign-up wall for the sender's identity, no social pressure, no awkwardness. Just honest words, anonymously delivered.

The name says it all: say it **pre**, not post.

---

## Why We Built It This Way

Every design decision ties back to one question: *what would make someone actually say the thing they've been holding back?*

**Anonymity** -- The hardest words to say aren't hard because of their content. They're hard because of what they reveal about us -- our vulnerability, our need, our love. Removing the sender's identity removes that barrier. You can say what you truly mean without worrying about how it changes the relationship.

**One message per person** -- You get exactly one message per recipient. This isn't a chat app. The constraint is the feature -- it forces you to think carefully about what you want to say, making each message meaningful rather than disposable.

**No edits, no take-backs** -- Once sent, a message can't be edited or deleted by the sender. This mirrors the weight of real words spoken out loud. It makes people write with intention.

**Pay it forward** -- To read a message someone wrote for you, you first have to write one for someone else. This creates a chain reaction of kindness. Every reader becomes a writer. The platform grows through generosity, not marketing.

**Text only** -- No images, no GIFs, no formatting. Just words. This keeps the focus on what matters: what you have to say to someone.

---

## How the Credit System Works

The credit system is the engine that makes the platform self-sustaining:

- Write a message to someone --> you earn 1 credit
- Read an unread message in your inbox --> costs 1 credit
- Re-read a message you've already opened --> free

So the first thing any user does is write. They can't consume without giving first. This single mechanic replaces traditional growth strategies -- every new reader creates a new message for someone else.

---

## The Tech Behind It

We chose a simple, modern stack that lets us move fast and stay lean:

**Next.js** is the backbone -- it handles both the website (frontend) and the server logic (API) in a single codebase. No separate backend server to maintain. Pages are server-rendered for speed and SEO, with client-side interactivity where needed.

**PostgreSQL + Prisma** for the database. Prisma gives us a clean, type-safe way to talk to the database without writing raw SQL. The schema is simple: four tables (Users, Messages, MagicLinks, Reports) that cover everything the platform needs.

**Passwordless authentication** via magic links. Users enter their email, receive a one-time link, click it, and they're in. No passwords to remember, no passwords to leak. The link expires in 15 minutes and can only be used once. Sessions last 30 days via a secure cookie.

**Resend** for transactional emails -- login links, new message notifications, and gentle reminders if a message goes unread for a week.

**Tailwind CSS** for styling. It lets us build a clean, mobile-first design without maintaining a separate CSS codebase. The site supports light and dark modes.

**Vercel** for hosting. It integrates natively with Next.js, gives us automatic deployments from Git, and handles the daily cron job that sends reminder emails.

---

## Architecture at a Glance

The app follows a straightforward pattern:

```
User's Browser
    |
    v
Next.js (Pages + API Routes)  <-->  PostgreSQL (via Prisma)
    |
    v
Resend (Email Delivery)
```

**Pages** handle what users see -- the landing page, dashboard, inbox, message composer, and static content pages (why, how, privacy policy).

**API Routes** handle what happens behind the scenes -- sending messages, reading messages, logging in, reporting content, and admin operations.

**Middleware** protects routes -- unauthenticated users are redirected to login, and already-logged-in users skip the login page.

**Cron job** runs once daily to send reminder emails for messages that have been sitting unread for a week.

Everything lives in one Next.js project. There's no microservice complexity -- just a monolith that's simple to reason about, deploy, and maintain.

---

## What Users Experience

**First visit:** A clean landing page explains the concept. One button: "Write a Message."

**Writing:** Enter a recipient's name, their email, and your message. Content is filtered for harmful language. Hit send. You earn a credit.

**Receiving:** The recipient gets an email saying someone wrote something for them. They sign in (or create an account via magic link), write a message to someone *they* care about, and then use that earned credit to read their message.

**Dashboard:** Shows unread messages, read messages, and sent messages at a glance. First-time users see a brief onboarding walkthrough.

**Inbox:** Lists all received messages with read/unread status. Unread messages show a lock icon if the user has no credits -- guiding them to write first.

**Sent:** Shows all messages the user has written, whether they've been read by the recipient, and when they were sent.

---

## Keeping It Safe

**Content filtering** catches profanity and hate speech before messages are sent, including common evasion tricks like replacing letters with numbers.

**User reporting** lets recipients flag inappropriate messages. Reports go to an admin dashboard for review.

**Admin tools** let designated admins view platform stats, review reports, and suspend bad actors. Admins cannot read messages unless they've been reported -- privacy is the default.

**Soft deletes** mean nothing is permanently destroyed. Deleted messages are hidden but preserved for moderation purposes.

---

## A Note on Implementation

The codebase is intentionally minimal. Four database tables. Eight reusable UI components. Five shared utility modules. The whole app fits in a single `/src` folder.

We avoided over-engineering at every turn. No state management library -- server components and URL parameters handle state. No separate backend -- Next.js API routes serve the same purpose with less overhead. No complex deployment pipeline -- Vercel deploys on every push to main.

The result is an app that's easy to understand, easy to change, and easy to hand off. If you can read React and SQL, you can work on this codebase.

---

*Built with Next.js, PostgreSQL, Prisma, Resend, Tailwind CSS, and Vercel.*
