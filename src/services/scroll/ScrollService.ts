export class ScrollService {
  public initSmoothScroll(): void {
    // Global Event Delegation: Catch clicks on any anchor link, even if added dynamically
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');

      // Only handle internal hash links
      if (href && href.startsWith('#') && href !== '#') {
        const scrollTarget = document.querySelector(href);

        if (scrollTarget) {
          e.preventDefault();
          scrollTarget.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    });
  }
}
