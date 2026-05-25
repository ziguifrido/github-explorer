# GitHub Explorer

High-performance dashboard for exploring GitHub profiles and repositories.

**v0.2.0**

## Features

- **Smart search** — auto-detects whether input is a user (`torvalds`) or repository (`facebook/react`)
- **User dashboard** — full profile, aggregated stats (stars, forks), language distribution chart, repository list with search, language filter, sorting, and pagination
- **Repository dashboard** — metadata, rendered README, commit timeline, contributors, language breakdown with percent bar
- **Light / Dark theme** — toggles via navbar button, follows system preference by default, persists choice in a cookie (365 days)
- **GitHub Primer color palette** — light mode (`#ffffff` / `#1F2328` / `#0969da`) and dark mode (`#0d1117` / `#e6edf3` / `#58a6ff`)
- **Stack navigation** — "Back to User" button when navigating from profile to repository
- **Persistent history** — last 10 queries saved to `localStorage`
- **Skeleton loading** — loading states for user and repository dashboards
- **PWA** — installable as standalone app with dark/light theme-color support

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 + `tw-animate-css` + `light-dark()` CSS function
- **UI:** Base UI React + custom components (shadcn-style)
- **State:** Zustand v5 with local persistence
- **Animations:** Framer Motion v12
- **Charts:** Recharts v3 (language donut chart)
- **Markdown:** react-markdown + remark-gfm
- **PWA:** Web App Manifest + service worker via Next.js PWA plugin
- **Icons:** Lucide React

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
src/
├── app/
│   ├── layout.tsx         # root layout with Geist fonts, theme-color, ThemeProvider
│   ├── page.tsx           # main page with view switching + footer
│   └── globals.css        # global styles, GitHub Primer palette, light-dark() variables
├── components/
│   ├── LayoutHeader.tsx    # sticky header with nav, theme toggle, logo → project repo
│   ├── ThemeToggle.tsx     # light/dark toggle (Sun/Moon)
│   ├── ViewSearch.tsx      # initial search screen
│   ├── ViewUser.tsx        # user profile dashboard
│   ├── ViewRepo.tsx        # repository dashboard
│   ├── DashboardSkeletons.tsx
│   └── ui/                 # base components (shadcn-style)
├── lib/
│   ├── github.ts           # GitHub REST API client
│   ├── theme.tsx           # ThemeProvider, useTheme, cookie persistence
│   └── utils.ts            # cn() utility
└── store/
    └── useAppStore.ts      # global state (Zustand + persist)
```
