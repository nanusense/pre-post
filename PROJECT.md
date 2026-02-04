# Pre-Post: Say It While They Can Hear It

A simple, mobile-first website for writing anonymous heartfelt messages to people you care about — before it's too late.

## The Problem

We often say the best things about people only after they're gone. Eulogies are filled with words the deceased never got to hear. This platform changes that.

## Core Concept

- Write anonymous messages to people you know well
- Recipients are notified that someone wrote something for them
- To read a message, you must first write one for someone else ("pay it forward")
- Simple, text-only, mobile-friendly interface

---

## Features

### 1. User Registration

- Register using email ID
- Ensures user authenticity while maintaining message anonymity

### 2. Writing a Message

- Input recipient's name and email
- Guided message writing with tooltip-style prompts
- Sending a message earns **1 credit point**

### 3. Notification System

- Recipients receive an anonymous email notification
- Email includes instructions on how to access the message
- No sender information revealed

### 4. Pay It Forward Mechanism

- To read a message written for you, you must first write one for someone else
- Creates a continuous cycle of positive feedback
- Ensures active participation

### 5. Credit Points System

| Action | Credits |
|--------|---------|
| Write a message | +1 |
| Read a message | -1 |

- Maintains balance between writing and receiving
- Encourages equal participation

### 6. User Interface

- Simple, intuitive, mobile-first design
- **Text-only** — no images
- Focus on privacy and security
- Static pages for guidance:
  - "Why" — the philosophy behind the platform
  - "How To" — tips for writing meaningful messages

### 7. Admin Section

- Dashboard showing:
  - Total users
  - Messages sent
  - Messages viewed
- Ability to suspend users if needed

---

## Technical Recommendations

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (or SQLite to start) |
| Auth | Email + magic link (passwordless) |
| Email | Resend or SendGrid |
| Hosting | Vercel (free tier) |

### Why This Stack?

- Single codebase (frontend + backend)
- Easy deployment
- Mobile-responsive out of the box
- Scales if needed
- Free tier friendly

---

## Open Questions

1. **Message visibility timing** — Immediate or delayed reveal?
2. **One message per pair?** — Can someone write multiple messages to the same person?
3. **Message editing** — Can senders edit/delete after sending?
4. **Email verification** — Required before viewing messages?

---

## Project Status

- [ ] Finalize requirements
- [ ] Set up project structure
- [ ] Implement authentication
- [ ] Build message writing flow
- [ ] Build notification system
- [ ] Implement credit system
- [ ] Create admin dashboard
- [ ] Deploy
