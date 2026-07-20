import { useEffect, useRef } from "react";

/**
 * Adds a "reveal" fade+rise animation to any element with the given
 * ref once it scrolls into view. Pure CSS + IntersectionObserver,
 * no extra libraries required.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal"> ... </div>
 */
export default function useScrollReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    //reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("is-visible");
        observer.unobserve(node);
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}