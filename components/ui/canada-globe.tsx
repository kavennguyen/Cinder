"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/**
 * Globe held over Canada rather than spinning through the whole world, since
 * the Canadian focus is the point being made.
 *
 * Adapted from the bento demo's Globe: light theme rather than dark, brand
 * orange markers, and Canadian cities in place of San Francisco / New York.
 */

// cobe maps a lat/long to camera angles as
//   phi   = 3*PI/2 - long * PI/180
//   theta = lat * PI/180
// Central Canada is about 56N, 95W, which puts the country square on to the
// viewer. Eyeballed angles land it on the rim instead.
const CANADA_PHI = (3 * Math.PI) / 2 - (-95 * Math.PI) / 180 - 2 * Math.PI;
const CANADA_THETA = (52 * Math.PI) / 180;

// Rendered square, then cropped by the card. Kept modest so the WebGL canvas
// is cheap on a marketing page.
const SIZE = 420;

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

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: SIZE * 2,
      height: SIZE * 2,
      phi: CANADA_PHI,
      theta: CANADA_THETA,
      dark: 0,
      // On a light globe mapBrightness works the other way round: low values
      // keep the landmass dots dark against the white sphere. Anything high
      // washes them out to white and the globe reads as a blank blob.
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [1, 0.431, 0],
      glowColor: [1, 1, 1],
      markers: CITIES,
    });

    // cobe v2 drives animation through update() rather than the onRender
    // callback the older API exposed. Drifts a little so it feels alive
    // without ever rotating away from Canada.
    let drift = 0;
    let frame = 0;
    const tick = () => {
      drift += 0.0015;
      globe.update({ phi: CANADA_PHI + Math.sin(drift) * 0.12 });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Width only, with the height derived from aspectRatio. Setting both a
      // fixed height and maxWidth squashes the sphere into an oval on cards
      // narrower than SIZE.
      style={{ width: SIZE, maxWidth: "100%", aspectRatio: "1 / 1" }}
      className={className}
    />
  );
}
