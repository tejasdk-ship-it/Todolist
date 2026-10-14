# HabitForge — Daily Habit Tracker Web Application

A full-stack, responsive, production-ready daily habit tracking platform with accountability, calendar heatmaps, performance analytics, and community leaderboards.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**.

---

## Features

- **Daily Dashboard**: Interactive cards with completion checkboxes, motivational quotes, progress rings, and celebration confetti on 100% daily score.
- **Habit Management (CRUD)**: Create, edit, pause, archive, and delete habits with custom schedules (daily, weekdays, weekends, custom days), duration targets, priorities, and category themes.
- **Activity Calendar & History**: Month-by-month calendar with color-coded status badges (green = 100%, yellow = partial, red = missed). Interactive inspection panel for past notes and actual minutes spent.
- **Analytics & Recharts**: Area charts for completion trends, bar charts for minutes spent, donut charts for category distribution, and streak trackers.
- **Who's Winning Today? Leaderboard**: Fair scoring algorithm (+10 pts per habit, +5 pts perfect day bonus, +20 pts 7-day streak bonus) with tie-breakers.
- **Friends & Accountability Groups**: Connect with friends, create private groups, and challenge teammates.
- **User Profile & Settings**: Custom avatars, bio, daily goals, wake-up times, time zone sync, and JSON data export.
- **Mobile First**: Optimized layout for smartphones (bottom navigation bar, drawers) and desktop/laptops (sidebar, multi-column dashboard).

---

## 🚀 Quick Start (Local Development)

### 1. Install & Run Dev Server
```bash
cd habit-tracker
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser!

> 💡 **Instant Test Mode**: You can click **"1-Click Demo"** on the login page or visit `/dashboard` directly to experience the full app with 30 days of pre-populated habit history, streaks, and community leaderboard entries.

---

## 🗄️ Supabase PostgreSQL Setup

1. Go to [https://app.supabase.com](https://app.supabase.com) and create a **Free** project.
2. In your Supabase dashboard, navigate to **SQL Editor** -> **New Query**.
3. Open and copy the contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
   - This sets up all tables (`profiles`, `habits`, `habit_completions`, `friendships`, `groups`), Row Level Security (RLS) policies, and automatic profile triggers on signup.
4. (Optional) Run [`supabase/seed.sql`](./supabase/seed.sql) to add sample leaderboard users.
5. In your Supabase project, go to **Project Settings** -> **API**.
6. Copy your **Project URL** and **anon / public key**.
7. Create `habit-tracker/.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
   ```

---

## 🌐 Deploy to Vercel (Free Hobby Tier)

1. Push your repository to GitHub.
2. Log into [https://vercel.com](https://vercel.com) and click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `habit-tracker`.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**. Your application will be live on a `*.vercel.app` URL in under 2 minutes!

---

## 🛡️ Security & Architecture

- **Row Level Security (RLS)**: Enforces that users can only modify their own private habits, completions, and notes.
- **Safe Leaderboard**: Public leaderboard queries expose only non-sensitive statistics (points, streak, completion %), never emails or passwords.
- **No Secret Key Exposure**: Only the public anon key is used on the client.
