# Code Quality + SOLID Architecture Plan

## Objective

Improve code quality, consistency, and long-term maintainability using better engineering practices and SOLID-driven frontend module design.

## Problems in Current Shape

- Single large script with mixed responsibilities.
- Tight coupling between DOM selection, business rules, and UI updates.
- Repeated selector and style mutation patterns.
- Minimal error modeling for external calls (Formspree).
- Hard to unit test because logic is mostly side-effect driven.

## Principles to Apply

## S — Single Responsibility

Each module does one thing:

- `cursor`: cursor animation only
- `reveal`: intersection observer logic only
- `nav`: nav scroll style behavior only
- `contactForm`: validation + submit flow
- `carousel`: slide state and autoplay behavior

## O — Open/Closed

Design extension points:

- Config objects for timings/selectors/colors.
- Add new animations or validators without editing existing core logic.

## L — Liskov Substitution

Keep interchangeable strategy contracts:

- Validation strategy interface
- Submission transport interface (Formspree now, another provider later)

Any replacement must preserve expected behavior.

## I — Interface Segregation

Avoid giant interfaces:

- Small focused contracts:
  - `Validator`
  - `SubmitTransport`
  - `CarouselScheduler`

Consumers depend only on what they use.

## D — Dependency Inversion

High-level flow depends on abstractions, not concrete APIs:

- Form service depends on `SubmitTransport` interface, not direct `fetch` call.
- Time-based logic depends on scheduler wrapper (`setInterval` abstraction).

## Architecture Target

```text
src/
  app/
    bootstrap.ts
  modules/
    cursor/
    reveal/
    nav/
    form/
    carousel/
  services/
    http/
    form/
  shared/
    dom/
    utils/
    types/
```

## Better Practices Checklist

1. **Typing & Contracts**
   - TypeScript strict mode enabled.
   - Explicit public function signatures.
   - Shared types centralized in `shared/types`.

2. **Error Handling**
   - Domain-level error messages for users.
   - Technical details isolated for debugging.
   - No silent failures for missing required DOM elements.

3. **DOM Access Discipline**
   - Centralize selectors/constants.
   - Use typed DOM helpers.
   - Guard missing optional nodes.

4. **Configuration over Hardcoding**
   - Move magic numbers (timings, thresholds, colors) into config constants.

5. **Testing Strategy**
   - Unit tests for pure logic (validators, carousel index math).
   - Integration tests for form flow and major UI behaviors.

6. **Code Style & Automation**
   - ESLint + Prettier.
   - CI checks for typecheck, lint, tests.
   - Conventional Commits for traceable history.

## Execution Plan

## Phase 1: Stabilize Structure

- Split monolithic file into modules.
- Introduce shared DOM and error helpers.
- Keep behavior unchanged.

## Phase 2: Type Safety + Contracts

- Migrate all modules to TypeScript.
- Add interfaces for transport/validation/scheduler.
- Remove implicit `any` and unsafe DOM assumptions.

## Phase 3: Quality Gates

- Add lint + format config.
- Add typecheck/lint/test scripts.
- Add CI workflow enforcing quality gates.

## Phase 4: Test Coverage

- Cover pure logic first.
- Add integration tests for critical UX paths:
  - Contact form
  - Carousel interactions
  - Scroll reveal

## Phase 5: Refine Extensibility

- Move feature options to configuration objects.
- Add adapter pattern for external form provider.

## Success Criteria

- Clear module boundaries and low coupling.
- SOLID-aligned contracts for replaceable parts.
- Automated quality gates preventing regressions.
- Faster onboarding and safer feature iteration.

