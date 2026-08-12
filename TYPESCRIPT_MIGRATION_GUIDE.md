# TypeScript Migration Guide (Airport Studio)

## Goal

Migrate current JavaScript frontend to TypeScript with minimal risk, preserving behavior while increasing type safety, maintainability, and refactor confidence.

## Current Baseline

- Static frontend project (`index.html`, `css/`, `js/main.js`).
- Main logic in one file with several responsibilities:
  - Cursor effects
  - Scroll reveal
  - Navigation scroll behavior
  - Form submission (Formspree)
  - Hero carousel

## Target Structure

```text
airportstudio/
  src/
    main.ts
    modules/
      cursor.ts
      scrollReveal.ts
      nav.ts
      form.ts
      heroCarousel.ts
    types/
      dom.ts
  dist/
    main.js
  tsconfig.json
  package.json
```

## Migration Strategy

### Phase 1: Tooling Setup

1. Initialize Node project.
2. Install TypeScript and optional dev helpers:
   - `typescript`
   - `@types/node` (optional, useful for tooling scripts)
3. Add scripts:
   - `"build": "tsc"`
   - `"typecheck": "tsc --noEmit"`
   - `"watch": "tsc --watch"`

### Phase 2: Compiler Configuration

Create `tsconfig.json` (strict-first, browser-focused):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "ES2020"],
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
```

### Phase 3: File Split + Progressive Typing

1. Copy `js/main.js` into `src/main.ts`.
2. Extract each feature into `src/modules/*.ts`.
3. Keep behavior identical during split (no logic rewrites yet).
4. Replace untyped selectors with typed helpers and null checks.

Example helper pattern:

```ts
export function getRequiredElement<T extends Element>(
  selector: string,
  parent: ParentNode = document
): T {
  const el = parent.querySelector<T>(selector);
  if (!el) throw new Error(`Missing required element: ${selector}`);
  return el;
}
```

### Phase 4: Safer DOM and Events

- Avoid direct `querySelector(...).value` without guards.
- Narrow element types (`HTMLInputElement`, `HTMLButtonElement`, etc.).
- Add explicit event types:
  - `MouseEvent`
  - `SubmitEvent`
- Type async responses (`Response`) and error branches.

### Phase 5: HTML Wiring

1. Update `index.html` to load compiled output:
   - from `js/main.js` to `dist/main.js`.
2. Ensure build runs before deployment.

## Module Contracts (Recommended)

- `cursor.ts`:
  - `export function initCursor(): void`
- `scrollReveal.ts`:
  - `export function initScrollReveal(): void`
- `nav.ts`:
  - `export function initNav(): void`
- `form.ts`:
  - `export async function submitForm(): Promise<void>`
- `heroCarousel.ts`:
  - `export function initHeroCarousel(): void`

## Strictness Rules

Use these rules from day 1:

- No `any` (except temporary migration marker with TODO).
- No non-null assertion (`!`) unless impossible to avoid.
- Throw explicit error for missing required DOM node.
- Keep public function signatures explicit.

## Risk Controls

- Migrate one module at a time.
- Keep visual/interaction behavior unchanged until all modules typed.
- Validate critical flows after each module:
  - Cursor animation
  - Form submission and failure message
  - Carousel autoplay + dot click + hover pause

## Definition of Done

- All runtime JS source moved to `src/**/*.ts`.
- `strict` typecheck passes.
- Build outputs to `dist/main.js`.
- `index.html` uses compiled artifact.
- No regressions in core UX interactions.

