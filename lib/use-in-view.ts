"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True while the element is on (or near) screen and the tab is in front.
 *
 * Used to stop decorative animation from running when nobody can see it.
 * A looping animation left unguarded keeps compositing every frame for the
 * whole visit, which is what makes long marketing pages feel heavy on phones.
 */
// Returns a tuple rather than an object: a returned property literally named
// `ref` makes the react-hooks/refs lint treat every access on the result as a
// ref read during render.
export function useInView<T extends HTMLElement>(
  rootMargin = "200px",
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let onScreen = false;
    const sync = () => setInView(onScreen && !document.hidden);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin },
    );
    io.observe(el);

    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rootMargin]);

  return [ref, inView];
}
