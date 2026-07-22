export const revealVariants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
  hidden: { y: -16, opacity: 0 },
};
