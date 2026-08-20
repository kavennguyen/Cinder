"use client";

import {
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

/**
 * Text that reveals by sliding each word or character up out of a clipped box.
 *
 * Adapted from danielpetho/vertical-cut-reveal. Differences: uses the `motion`
 * package this codebase already has rather than framer-motion, and joins class
 * names locally since there is no `cn` helper here (no shadcn).
 */

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TextProps {
  children: ReactNode;
  reverse?: boolean;
  transition?: Transition;
  splitBy?: "words" | "characters" | "lines" | string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  containerClassName?: string;
  wordLevelClassName?: string;
  elementLevelClassName?: string;
  onClick?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  autoStart?: boolean;
}

export interface VerticalCutRevealRef {
  startAnimation: () => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
  className?: string;
}

const VerticalCutReveal = forwardRef<VerticalCutRevealRef, TextProps>(
  (
    {
      children,
      reverse = false,
      transition = { type: "spring", stiffness: 190, damping: 22 },
      splitBy = "words",
      staggerDuration = 0.2,
      staggerFrom = "first",
      containerClassName,
      wordLevelClassName,
      elementLevelClassName,
      onClick,
      onStart,
      onComplete,
      autoStart = true,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    /**
     * Flatten children into runs of text tagged with the className of the
     * element they came from, so inline accent spans (e.g. an orange
     * highlight) survive the split instead of being stringified away.
     */
    const runs = useMemo(() => {
      const acc: { text: string; className?: string }[] = [];
      const walk = (node: ReactNode, className?: string) => {
        if (node === null || node === undefined || typeof node === "boolean") return;
        if (typeof node === "string" || typeof node === "number") {
          acc.push({ text: String(node), className });
          return;
        }
        if (Array.isArray(node)) {
          node.forEach((n) => walk(n, className));
          return;
        }
        if (isValidElement(node)) {
          const props = node.props as { className?: string; children?: ReactNode };
          walk(props.children, props.className ?? className);
        }
      };
      walk(children);
      return acc;
    }, [children]);

    const text = runs.map((r) => r.text).join("");

    /** className for each character position, so words keep their accent. */
    const classAt = useMemo(() => {
      const out: (string | undefined)[] = [];
      runs.forEach((r) => {
        for (let i = 0; i < r.text.length; i++) out.push(r.className);
      });
      return out;
    }, [runs]);

    const [isAnimating, setIsAnimating] = useState(false);

    // The hidden state parks each word outside a clipped box, so text that
    // never animates is text nobody can read. Users who ask for reduced motion
    // get it rendered at rest instead of sliding in.
    const prefersReducedMotion = useReducedMotion();

    const splitIntoCharacters = (value: string): string[] => {
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        return Array.from(segmenter.segment(value), ({ segment }) => segment);
      }
      return Array.from(value);
    };

    const elements = useMemo(() => {
      const words = text.split(" ");
      if (splitBy === "characters") {
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      if (splitBy === "words") return text.split(" ");
      if (splitBy === "lines") return text.split("\n");
      return text.split(splitBy);
    }, [text, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number) => {
        const total =
          splitBy === "characters"
            ? elements.reduce(
                (acc: number, word) =>
                  acc +
                  (typeof word === "string"
                    ? 1
                    : word.characters.length + (word.needsSpace ? 1 : 0)),
                0,
              )
            : elements.length;
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
          return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
          return (
            Math.abs(Math.floor(Math.random() * total) - index) * staggerDuration
          );
        }
        return Math.abs(staggerFrom - index) * staggerDuration;
      },
      [elements, splitBy, staggerFrom, staggerDuration],
    );

    const startAnimation = useCallback(() => {
      setIsAnimating(true);
      onStart?.();
    }, [onStart]);

    useImperativeHandle(ref, () => ({
      startAnimation,
      reset: () => setIsAnimating(false),
    }));

    useEffect(() => {
      if (autoStart) startAnimation();
    }, [autoStart, startAnimation]);

    const variants = {
      hidden: { y: reverse ? "-100%" : "100%" },
      visible: (i: number) => ({
        y: 0,
        transition: {
          ...transition,
          delay:
            ((transition as { delay?: number })?.delay || 0) +
            getStaggerDelay(i),
        },
      }),
    };

    // Tag each word with the className covering its first character, so an
    // accent span inside the heading keeps its colour after splitting.
    const words: WordObject[] = useMemo(() => {
      const base: WordObject[] =
        splitBy === "characters"
          ? (elements as WordObject[])
          : (elements as string[]).map((el, i) => ({
              characters: [el],
              needsSpace: i !== elements.length - 1,
            }));

      let offset = 0;
      return base.map((w) => {
        const len = w.characters.join("").length;
        const className = classAt[offset];
        offset += len + (w.needsSpace ? 1 : 0);
        return { ...w, className };
      });
    }, [elements, splitBy, classAt]);

    return (
      <span
        ref={containerRef}
        onClick={onClick}
        className={cx(
          containerClassName,
          "flex flex-wrap whitespace-pre-wrap",
          splitBy === "lines" && "flex-col",
        )}
      >
        <span className="sr-only">{text}</span>

        {words.map((wordObj, wordIndex, array) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0);

          return (
            <span
              key={wordIndex}
              aria-hidden="true"
              className={cx("inline-flex overflow-hidden", wordObj.className, wordLevelClassName)}
            >
              {wordObj.characters.map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={cx(
                    elementLevelClassName,
                    "whitespace-pre-wrap relative",
                  )}
                >
                  <motion.span
                    custom={previousCharsCount + charIndex}
                    initial={prefersReducedMotion ? "visible" : "hidden"}
                    animate={
                      prefersReducedMotion || isAnimating ? "visible" : "hidden"
                    }
                    variants={variants}
                    onAnimationComplete={
                      wordIndex === words.length - 1 &&
                      charIndex === wordObj.characters.length - 1
                        ? onComplete
                        : undefined
                    }
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
              {wordObj.needsSpace && <span> </span>}
            </span>
          );
        })}
      </span>
    );
  },
);

VerticalCutReveal.displayName = "VerticalCutReveal";

export { VerticalCutReveal };
