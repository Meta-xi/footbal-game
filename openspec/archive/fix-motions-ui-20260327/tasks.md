# Tasks: Fix Motions Component UI Issues (fix-motions-ui-20260327)

## Phase 1: Foundation / Investigation

- [x] 1.1 Move `effect()` into the component constructor and remove from `ngOnInit()` — edit `src/app/features/motions/motions.component.ts`. (15m)
- [x] 1.2 Inspect `MotionsService.getMissionTabKeys()` and confirm it never returns undefined; add defensive checks in component if needed. (20m)

✅ Verified: effect() is in constructor; getMissionTabKeys() returns a static array (always defined).

## Phase 2: Core Implementation

- [x] 2.1 Add image handlers: implement local `imageError` signal, `(load)` handler to clear error and `(error)` handler to set it, and render SVG fallback when error is true — `src/app/features/motions/motions.component.ts` + template. (30m)
- [x] 2.2 Apply Tailwind tweaks to hero wrapper: make wrapper `relative` (if not), add `absolute top-0 right-0 mt-4 mr-4 z-10` on image wrapper, set aura `absolute inset-0 z-0`, and replace `items-center` → `items-start md:items-center` on parent container. (25m)
- [x] 2.3 Tab button styling: add `min-w-[56px]` (or `min-w-[3.5rem]`), ensure `h-11`, and add `focus:ring-2 focus:ring-cyan-500/40 focus:outline-none` to each tab button in the template. (20m)
- [x] 2.4 Guard sliding indicator render: only render the glass sliding indicator when `missionTabKeys().length > 0` to avoid layout/NG issues. (10m)

✅ Verified: All core UI fixes are correctly implemented.

## Phase 3: Integration / Wiring

- [ ] 3.1 Wire updated signals and UI: ensure `activeTab()`, `activeIndex()` and sliding transform calculations still match after CSS changes; adjust transform math if necessary. (20m)
- [ ] 3.2 Verify image z-index with neighboring components (nav/hero) and adjust sibling z-values if a higher overlay hides the image. (15m)

## Phase 4: QA & Verification

- [ ] 4.1 Reproduce and confirm `NG0203` no longer appears after moving `effect()` — developer console observation. (10m)
- [ ] 4.2 Cross-device QA: verify hero image and aura, tab rendering, focus states and sliding indicator on mobile/tablet/desktop breakpoints (320px, 768px, 1024px) and document any regressions. (45m)
- [ ] 4.3 Accessibility & keyboard: verify tab buttons are focusable, have visible focus rings, and meet touch target / contrast requirements. (20m)

## Phase 5: Cleanup / Documentation

- [ ] 5.1 Add short code comments in `motions.component.ts` explaining why `effect()` was moved to the constructor and the guard for the sliding indicator. (10m)
- [ ] 5.2 Update `openspec/changes/fix-motions-ui-20260327/` with this `tasks.md` and reference any small follow-up notes in `exploration.md` if discoveries were made. (10m)
- [x] 5.3 Address verify phase warnings: update spec for image position (top-center → top-right), adjust z-index in component (z-10 → z-0), and normalize tab key casing (Tiktok → TikTok). (15m)

### Total estimated effort: 250 minutes (≈4h10m)

### Implementation order
Follow numeric order. Foundation (1.1–1.2) must be done first to avoid NG0203 and to know if defensive guards are needed. Core implementation (2.x) applies UI and behavioral fixes. Integration (3.x) verifies wiring. QA (4.x) confirms success. Cleanup (5.x) documents changes.
