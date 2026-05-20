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
