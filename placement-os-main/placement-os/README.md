# Placement OS 🚀

> Your AI-powered Placement Preparation Operating System — built for CSE students.

---

## ⚡ Quick Start (3 Steps)

### Step 1 — Configure Environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Get these from: **https://supabase.com** → Your Project → **Settings → API**

---

### Step 2 — Set Up Database (One-time)

1. Open your Supabase project → **SQL Editor**
2. Open `supabase-schema-custom-auth.sql` from this project root
3. Paste the entire file contents and click **Run**
4. You should see: *"Success. No rows returned."*

This creates all required tables (`app_users`, `user_progress`, etc.)

---

### Step 3 — Run the App

```bash
npm install
npm run dev
```

Open **http://localhost:3000** — sign up with a username and password!

---

## 🔐 Auth Architecture

This project uses **custom username/password authentication** — no email, no OTP, no OAuth.

| What | How |
|---|---|
| Password security | `bcryptjs` hashing (10 rounds) |
| Session storage | `localStorage` (persists across refreshes) |
| User database | Supabase PostgreSQL `app_users` table |
| Route protection | Client-side in `AuthProvider` |

**No Supabase Auth.** No SMTP setup. No email confirmation.

---

## 📚 Features

- **DSA Tracker** — 497 questions across 18 topics (Shradha Ma'am syllabus)
- **AI Mentor** — Gemini-powered study counselor
- **Aptitude Tests** — Mock tests with scoring
- **Projects Board** — Kanban for your portfolio projects
- **CS Core Tracker** — DBMS, OS, CN, OOP syllabus tracking
- **Analytics** — Daily progress charts, streaks, XP system
- **Revision Queue** — Spaced repetition system (SRS)
- **Company Targets** — Track target company preparation

---

## 🏗️ Build for Production

```bash
npm run build
npm run start
```

Or deploy directly to **Vercel** — just add the two environment variables in your Vercel project settings.

---

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL DB only)
- **Zustand** (state management)
- **bcryptjs** (password hashing)
- **Framer Motion** (animations)
- **Recharts** (analytics charts)

---

## ❓ Troubleshooting

**"Database tables not set up"** → Run `supabase-schema-custom-auth.sql` in Supabase SQL Editor

**"Database not configured"** → Check `.env.local` has correct Supabase URL and anon key

**"Username already taken"** → Choose a different username

**Build errors** → Run `npm install` first, then `npm run build`
