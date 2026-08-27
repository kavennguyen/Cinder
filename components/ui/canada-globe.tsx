"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/**
 * Globe held over Canada rather than spinning through the whole world, since
 * the Canadian focus is the point being made.
 *
 * Adapted from the bento demo's Globe: light theme rather than dark, brand
 * orange markers, and Canadian cities in place of San Francisco / New York.
 *
 * This is the most expensive thing on the homepage, so it is deliberately
 * defensive: it renders at the size it is actually displayed at, and it stops
 * rendering entirely whenever nobody can see it.
 */

// cobe maps a lat/long to camera angles as
//   phi   = 3*PI/2 - long * PI/180
//   theta = lat * PI/180
// Central Canada is about 56N, 95W, which puts the country square on to the
// viewer. Eyeballed angles land it on the rim instead.
const CANADA_PHI = (3 * Math.PI) / 2 - (-95 * Math.PI) / 180 - 2 * Math.PI;
const CANADA_THETA = (52 * Math.PI) / 180;

/** Widest the globe is ever drawn. Cards narrower than this get less. */
const MAX_SIZE = 420;

/** Extra render resolution on top of DPR, so the map dots stay visible. */
const SUPERSAMPLE = 1;

const CITIES: { location: [number, number]; size: number }[] = [
  { location: [43.6532, -79.3832], size: 0.09 }, // Toronto
  { location: [45.5019, -73.5674], size: 0.06 }, // Montreal
  { location: [49.2827, -123.1207], size: 0.06 }, // Vancouver
  { location: [51.0447, -114.0719], size: 0.05 }, // Calgary
  { location: [45.4215, -75.6972], size: 0.05 }, // Ottawa
];

export function CanadaGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let frame = 0;
    let drift = 0;
    let builtWidth = 0;
    let onScreen = false;

    const running = () =>
      frame !== 0;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const draw = () => globe?.update({ phi: CANADA_PHI + Math.sin(drift) * 0.12 });

    const tick = () => {
      drift += 0.0015;
      draw();
      frame = requestAnimationFrame(tick);
    };

    // Repaints over the first few seconds after a build so the world map is
    // shown once its texture uploads, even if the loop never runs.
    let settleTimers: number[] = [];
    const clearSettle = () => {
      settleTimers.forEach(window.clearTimeout);
      settleTimers = [];
    };
    const settle = () => {
      clearSettle();
      settleTimers = [0, 120, 300, 600, 1200, 2500].map((ms) =>
        window.setTimeout(draw, ms),
      );
    };

    // Only spin while the globe is actually on screen and the tab is in front.
    // Left unguarded this repaints a WebGL surface 60 times a second forever,
    // including while the visitor is thousands of pixels further down the page.
    const start = () => {
      if (running() || !globe) return;
      if (!onScreen || document.hidden) return;
      if (reduceMotion) {
        globe.update({ phi: CANADA_PHI });
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    // Building is deliberately NOT gated on visibility. Creating the globe is
    // a one-off cost that draws a single static frame; it is the rAF loop that
    // is expensive, and that is gated below. Gating the build too makes the
    // globe depend on IntersectionObserver ever firing, and a canvas that
    // silently stays blank is a worse failure than one wasted context.
    const build = () => {
      const cssWidth = Math.round(canvas.getBoundingClientRect().width);
      if (!cssWidth || cssWidth === builtWidth) return;

      stop();
      globe?.destroy();

      // cobe multiplies `width` by `devicePixelRatio` internally, so `width`
      // is CSS pixels — passing an already-doubled value squares the cost.
      // The old build passed a pre-doubled width on top of dpr 2 and rendered
      // ~6.8x oversampled, which is what made this expensive. DPR is also
      // capped at 2: a phone at 3 shades 2.25x the pixels for a difference
      // nobody can see on a decorative globe.
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * SUPERSAMPLE;

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: cssWidth,
        height: cssWidth,
        phi: CANADA_PHI,
        theta: CANADA_THETA,
        dark: 0,
        // On a light globe mapBrightness works the other way round: low values
        // keep the landmass dots dark against the white sphere. Anything high
        // washes them out to white and the globe reads as a blank blob.
        diffuse: 0.4,
        // Kept at full density. Dropping this thins the landmass out to
        // nothing at mobile sizes, and it is a one-off generation cost rather
        // than the per-frame cost that actually made the page heavy.
        mapSamples: 16000,
        mapBrightness: 1.2,
        baseColor: [1, 1, 1],
        markerColor: [1, 0.431, 0],
        glowColor: [1, 1, 1],
        markers: CITIES,
      });

      builtWidth = cssWidth;

      // cobe fetches its world map as an Image and uploads it on load, so a
      // frame drawn now shows the bare sphere with no landmass. When the loop
      // is running that resolves itself on the next frame, but a globe that is
      // paused — offscreen, backgrounded, or reduced-motion — would sit there
      // blank forever. Redraw a few times until the texture lands.
      settle();
      start();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          build();
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Rebuild at the new size after a rotate or resize, but not on every pixel.
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 200);
    });
    ro.observe(canvas);

    return () => {
      stop();
      clearSettle();
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      globe?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Width only, with the height derived from aspectRatio. Setting both a
      // fixed height and maxWidth squashes the sphere into an oval on cards
      // narrower than MAX_SIZE.
      style={{ width: MAX_SIZE, maxWidth: "100%", aspectRatio: "1 / 1" }}
      className={className}
    />
  );
}
