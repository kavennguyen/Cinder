# Cinder — Landing Page

React + TypeScript + Vite + Tailwind CSS.

## Requirements
- Node.js 18 or newer (works on Node 18, 20, 22).

## Run locally
```bash
npm install
npm run dev
```
Then open the URL it prints (default: http://localhost:5173/).

## Build for production
```bash
npm run build
npm run preview
```

## Notes on media
- Background videos/images are hotlinked from Pexels (free stock). If a video
  doesn't appear, your network or an ad-blocker may be blocking the Pexels CDN;
  swap the URL constant at the top of the relevant component in src/components/.
- Fonts: drop licensed TT Norms Pro .woff2 files into public/fonts/ (see the
  README there). Without them the page falls back to a system sans-serif.
