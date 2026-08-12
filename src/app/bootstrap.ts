import { initCursor } from '../modules/cursor/cursor.js';
import { initScrollReveal } from '../modules/reveal/reveal.js';
import { initNav } from '../modules/nav/nav.js';
import { initHeroCarousel } from '../modules/carousel/carousel.js';
import { ContactForm } from '../modules/form/form.js';
import { FormService } from '../services/form/FormService.js';
import { FetchTransport } from '../services/http/FetchTransport.js';
import { ScrollService } from '../services/scroll/ScrollService.js';

document.addEventListener('DOMContentLoaded', () => {
  // Services
  const transport = new FetchTransport();
  const formService = new FormService(transport, 'https://formspree.io/f/xykogljj');
  const scrollService = new ScrollService();

  // Initialization
  initCursor();
  initScrollReveal();
  initNav();
  initHeroCarousel();

  const contactForm = new ContactForm(formService);
  contactForm.init();

  scrollService.initSmoothScroll();
});
