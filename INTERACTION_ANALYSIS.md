# Interaction Analysis: Smooth Scroll Discrepancy

## Current Observed Behavior
- **"Trabajemos" (Navbar)**: Triggers the smooth scroll animation correctly.
- **Other Buttons** (e.g., "Iniciar Proyecto", "Explorar"): Do not trigger the JavaScript-based smooth scroll animation, defaulting to native browser behavior (which might feel "instant" or "jittery" depending on the environment).

## Technical Root Cause

The `ScrollService` I implemented uses the following selector to attach listeners:
```typescript
document.querySelectorAll('a[href^="#"]')
```

### Why "Trabajemos" works:
It is a simple anchor tag in the navbar:
```html
<a href="#contacto" class="nav-cta">Trabajemos</a>
```
It exists in the static DOM at the time the `DOMContentLoaded` event fires and `ScrollService.initSmoothScroll()` is called.

### Why others (might) be failing:

1. **Specific CSS Classes**: Buttons like "Iniciar Proyecto" use `class="btn-primary"`. In some CSS configurations, `pointer-events: none` or overlays might be blocking the click from reaching the anchor tag if there are nested elements (though looking at the HTML, they are direct `<a>` tags).

2. **Structural Timing**: If any elements are being moved or modified during the execution of other scripts (like the Hero Carousel logic), the listeners attached by `ScrollService` might be lost if the DOM nodes are replaced.

3. **CSS `scroll-behavior: smooth` Interference**: 
The `css/base.css` still contains:
```css
html {
  scroll-behavior: smooth;
}
```
When my JavaScript `e.preventDefault()` and `scrollIntoView` run, they are competing with the browser's native CSS smooth scroll. For some reason, on "Trabajemos" the JS wins/works, while on others, the native behavior (which might be failing or behaving differently) takes over.

4. **Missing Listeners on Dynamic Elements**: If "Explorar" or "Ver Servicios" are inside sections that are heavily manipulated by the `heroCarousel` or other modules, the initial `querySelectorAll` might miss them if they aren't fully ready or if they are replaced.

## Proposed Solution

To ensure **total consistency**, we should:

1. **Remove CSS Smooth Scroll**: Let the JavaScript `ScrollService` handle 100% of the movement to ensure identical behavior across all buttons.
2. **Global Event Delegation**: Instead of finding all links at startup, use a global listener on the `document` that catches any click on a hash link. This is more robust against dynamic content.

```typescript
// Proposed Refactor for ScrollService
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const anchor = target.closest('a');
  if (anchor && anchor.hash && anchor.origin === window.location.origin) {
    // Smooth scroll logic here...
  }
});
```
