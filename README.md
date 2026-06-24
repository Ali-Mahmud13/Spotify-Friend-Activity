# Private Spotify Friend Activity Dashboard

A premium, mobile-first Next.js dashboard for private Spotify friend activity.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase JS client

## Setup

```bash
npm install
npm run dev
```

To use Supabase, create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If either value is missing, the app automatically renders dummy data.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Set these Environment Variables in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not add a Supabase `service_role` key to the frontend or Vercel client env.

Vercel settings:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave default

The app uses dynamic server-rendered routes for live dashboard data and falls
back to dummy data if the Supabase public env vars are not present.
