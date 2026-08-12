export interface RevealConfig {
  selector: string;
  threshold: number;
  revealClass: string;
  staggerDelay: number;
}

export const DEFAULT_REVEAL_CONFIG: RevealConfig = {
  selector: '.reveal',
  threshold: 0.1,
  revealClass: 'vis',
  staggerDelay: 90,
};

export function initScrollReveal(config: RevealConfig = DEFAULT_REVEAL_CONFIG): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add(config.revealClass), i * config.staggerDelay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: config.threshold },
  );

  document.querySelectorAll(config.selector).forEach((el) => observer.observe(el));
}
