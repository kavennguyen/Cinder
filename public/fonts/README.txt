Place the licensed TT Norms Pro font files here:
  - tt-norms-pro-regular.woff2   (weight 400)
  - tt-norms-pro-semibold.woff2  (weight 600)

The @font-face rules in src/index.css already reference these paths.
Until they are added, the page falls back to a system sans-serif
(font-display: swap), so the layout renders correctly without them.
