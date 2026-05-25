<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # start production server
npm run lint       # ESLint v9
```

Always run `npm run lint` after making changes. No typecheck script is configured; verify types via `npm run build` or `npx tsc --noEmit`.

All UI text is in English.

## Node.js

- **Required:** `>=22.0.0` (enforced via `package.json` `engines`)
- **Recommended:** `22.14.x` (LTS, used in CI)
- **Version files:** `.nvmrc` (nvm), `.node-version` (fnm/nodenv)
- **Docker:** `node:22-alpine` (dev & production)
- **Local:** Node.js 26 is known to work; run `nvm use` or `fnm use` to match CI.

## Theme system

Uses CSS `light-dark()` function — no JavaScript FOUC script needed. Theme is
controlled via `color-scheme` on `<html>` (set by `ThemeProvider` in
`src/lib/theme.tsx`). User preference is persisted in a `theme` cookie (365 days).

- Add new color variables using `light-dark(lightValue, darkValue)` in `:root`
- Map them in `@theme inline` block to make Tailwind utilities available
- `useTheme()` hook provides `{ theme, toggleTheme }`

When working with `<Image />` from `next/image`, ensure the remote hostname is
added to `images.remotePatterns` in `next.config.ts`.

> **Troubleshooting:** if `npm run dev` fails with `Cannot find module '../server/require-hook'`, run:
> ```bash
> rm node_modules/.bin/next && ln -s ../next/dist/bin/next node_modules/.bin/next
> ```
> This fixes a Node.js 26 quirk where npm creates a regular file instead of a symlink for `.bin/next`.

## Docker

```bash
docker compose up --build   # development with hot reload
docker build -t github-explorer . && docker run -p 3000:3000 github-explorer   # production
```
