# GitHub Explorer

High-performance dashboard to explore GitHub profiles and repositories.

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 + `tw-animate-css`
- **UI:** Base UI React + custom components (shadcn-style)
- **State:** Zustand v5 with local persistence
- **Animations:** Framer Motion v12
- **Charts:** Recharts v3 (language donut chart)
- **Markdown:** react-markdown + remark-gfm
- **PWA:** `@ducanh2912/next-pwa` (service worker, offline support)
- **Icons:** Lucide React

## Features

- **Smart search** — auto-detects whether input is a user (`torvalds`) or repository (`facebook/react`)
- **User dashboard** — full profile, aggregated stats (stars, forks), language distribution chart, repository list with search, language filter, sorting, and pagination
- **Repository dashboard** — metadata, rendered README, commit timeline, contributors, language breakdown with percent bar
- **Stack navigation** — "Back to User" button when navigating from profile to repository
- **Persistent history** — last 10 queries saved to `localStorage`
- **Skeleton loading** — loading states for user and repository dashboards
- **PWA** — installable as standalone app, works offline (service worker caching)
- **Dark theme** — zinc/violet/emerald palette, glassmorphism design

## Prerequisites

- Node.js 20+
- (Optional) `NEXT_PUBLIC_GITHUB_TOKEN` in `.env.local` to increase GitHub API rate limit

## Commands

```bash
npm run dev        # development server (--webpack)
npm run build      # production build (--webpack)
npm run start      # start production server
npm run lint       # run ESLint v9
```

## Docker

### Development (with hot reload)

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The server auto-reloads on file changes.

### Production

```bash
docker build -t github-explorer .
docker run -p 3000:3000 github-explorer
```

## Structure

```
.dockerignore
Dockerfile
Dockerfile.dev
docker-compose.yml
src/
├── app/
│   ├── layout.tsx        # root layout with Geist fonts, PWA metadata
│   ├── page.tsx          # main page with view switching
│   └── globals.css       # global styles + Tailwind v4
├── components/
│   ├── LayoutHeader.tsx   # sticky header with navigation
│   ├── ViewSearch.tsx     # initial search screen
│   ├── ViewUser.tsx       # user profile dashboard
│   ├── ViewRepo.tsx       # repository dashboard
│   ├── DashboardSkeletons.tsx
│   └── ui/                # base components (shadcn-style)
├── lib/
│   ├── github.ts          # GitHub REST API client
│   └── utils.ts           # cn() utility
└── store/
    └── useAppStore.ts     # global state (Zustand + persist)
```
