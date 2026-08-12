import { getRequiredElement } from '../../shared/dom/dom.js';

export interface NavConfig {
  selector: string;
  scrollThreshold: number;
  activeColor: string;
  inactiveColor: string;
}

export const DEFAULT_NAV_CONFIG: NavConfig = {
  selector: '#nav',
  scrollThreshold: 60,
  activeColor: 'rgba(242,242,240,0.2)',
  inactiveColor: 'rgba(242,242,240,0.1)',
};

export function initNav(config: NavConfig = DEFAULT_NAV_CONFIG): void {
  const nav = getRequiredElement<HTMLElement>(config.selector);

  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor =
      window.scrollY > config.scrollThreshold ? config.activeColor : config.inactiveColor;
  });
}
