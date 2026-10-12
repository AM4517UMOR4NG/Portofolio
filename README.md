# Alogo's portfolio

Personal portfolio for A.M. Alogo Situmorang. A responsive editorial design with a charcoal and lime palette, an illustrated robot avatar, project illustrations, and the original red cursor trail.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
```

Vite builds all eight page entry points into `dist/`. Vercel uses the existing Git integration for production deployments from `main`; `vercel.json` retains clean URLs and security headers.

Pages: home, work, about, open source, journal, playground, contact, and preferences. Project filters, device-local preferences, GitHub activity, Snake, and Tetris are included. The cursor implementation in `src/effects/cursor.ts` is preserved.
