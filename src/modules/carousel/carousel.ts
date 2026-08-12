import { getRequiredElement } from '../../shared/dom/dom.js';

export interface CarouselConfig {
  slideSelector: string;
  dotSelector: string;
  carouselSelector: string;
  autoplayInterval: number;
  activeClass: string;
}

export const DEFAULT_CAROUSEL_CONFIG: CarouselConfig = {
  slideSelector: '.hero-carousel-slide',
  dotSelector: '.hero-carousel-dot',
  carouselSelector: '.hero-carousel',
  autoplayInterval: 4000,
  activeClass: 'active',
};

export function initHeroCarousel(config: CarouselConfig = DEFAULT_CAROUSEL_CONFIG): void {
  const slides = document.querySelectorAll(config.slideSelector);
  const dots = document.querySelectorAll(config.dotSelector);

  if (!slides.length) return;

  let current = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  function goTo(index: number): void {
    const currentSlide = slides[current];
    const currentDot = dots[current];

    if (currentSlide) currentSlide.classList.remove(config.activeClass);
    if (currentDot) currentDot.classList.remove(config.activeClass);

    current = (index + slides.length) % slides.length;

    const nextSlide = slides[current];
    const nextDot = dots[current];

    if (nextSlide) nextSlide.classList.add(config.activeClass);
    if (nextDot) nextDot.classList.add(config.activeClass);
  }

  function next(): void {
    goTo(current + 1);
  }

  function startAutoplay(): void {
    interval = setInterval(next, config.autoplayInterval);
  }

  function stopAutoplay(): void {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goTo(i);
      startAutoplay();
    });
  });

  const carousel = getRequiredElement<HTMLElement>(config.carouselSelector);
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}
