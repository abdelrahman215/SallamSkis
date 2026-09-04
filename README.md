# Sallam Skis — Premium Jet Ski Website

A modern, mobile-first website for **Sallam Skis** built with Next.js 15, Tailwind CSS, and Supabase.

## Features

- **Video hero background** with autoplay, mute/unmute toggle, and mobile-optimized fallback
- **Full appointment booking system** with double-booking prevention
- **Admin dashboard** for managing appointments, services, gallery, and testimonials
- **Instagram-inspired gallery** with lightbox preview
- **WhatsApp floating button** for instant customer communication
- **SEO optimized** with Open Graph metadata
- **Fully responsive** — optimized for iPhone, Android, and desktop

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your hero video

Place your video file at:

```
public/videos/hero.mp4
```

The hero section autoplays this video (muted by default) with a mute/unmute button. If no video is found, it falls back to a high-quality poster image.

### 3. Configure Supabase (optional but recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in the SQL Editor
3. Create an admin user in Authentication
4. Copy `.env.example` to `.env.local` and fill in your keys

The site works in **demo mode** without Supabase — bookings show a confirmation but aren't persisted.

### 4. Update contact info

Edit `lib/constants.ts` to set your real phone number, WhatsApp, email, and location.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Dashboard

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to manage appointments and business settings.

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- Supabase (Database + Auth)
- Framer Motion (Animations)
- Lucide React (Icons)
