import { getRequiredElement } from '../../shared/dom/dom.js';

export interface CursorConfig {
  cursorSelector: string;
  ringSelector: string;
  interactiveSelector: string;
  cursorActiveSize: string;
  ringActiveSize: string;
  cursorNormalSize: string;
  ringNormalSize: string;
  cursorClickSize: string;
  ringClickSize: string;
  smoothing: number;
}

export const DEFAULT_CURSOR_CONFIG: CursorConfig = {
  cursorSelector: '#cursor',
  ringSelector: '#cursorRing',
  interactiveSelector: 'a, button, .svc, .feature, .step, .p-item',
  cursorActiveSize: '18px',
  ringActiveSize: '56px',
  cursorNormalSize: '8px',
  ringNormalSize: '32px',
  cursorClickSize: '12px',
  ringClickSize: '40px',
  smoothing: 0.1,
};

export function initCursor(config: CursorConfig = DEFAULT_CURSOR_CONFIG): void {
  const cur = getRequiredElement<HTMLElement>(config.cursorSelector);
  const ring = getRequiredElement<HTMLElement>(config.ringSelector);

  let mx = -100,
    my = -100,
    rx = -100,
    ry = -100;

  document.addEventListener('mousemove', (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Click animations
  document.addEventListener('mousedown', () => {
    cur.style.transform = 'translate(-50%, -50%) scale(0.7)';
    ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
  });

  document.addEventListener('mouseup', () => {
    cur.style.transform = 'translate(-50%, -50%) scale(1)';
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  (function loop(): void {
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    rx += (mx - rx) * config.smoothing;
    ry += (my - ry) * config.smoothing;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll(config.interactiveSelector).forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.addEventListener('mouseenter', () => {
      cur.style.width = config.cursorActiveSize;
      cur.style.height = config.cursorActiveSize;
      ring.style.width = config.ringActiveSize;
      ring.style.height = config.ringActiveSize;
    });
    htmlEl.addEventListener('mouseleave', () => {
      cur.style.width = config.cursorNormalSize;
      cur.style.height = config.cursorNormalSize;
      ring.style.width = config.ringNormalSize;
      ring.style.height = config.ringNormalSize;
    });
  });
}
