# Tasks: Fix motions layout on mobile (/mociones)

## Phase 1: Foundation (Investigation / Review)

- [x] 1.1 Inspect hero image wrapper classes in src/app/pages/mociones/mociones.component.html — confirm wrapper element and current Tailwind classes. (15m)
- [x] 1.2 Inspect the <nav> container and tab markup in src/app/pages/mociones/mociones.component.html and src/app/pages/mociones/mociones.component.ts — record current classes and indicator logic. (20m)
- [x] 1.3 Identify any shared components used (e.g., src/app/components/tabs/*) and list files that will need changes. (15m)

## Phase 2: Hero Image Centering

- [x] 2.1 Update hero wrapper classes in src/app/pages/mociones/mociones.component.html to use responsive centering (e.g., `flex items-center justify-center w-full` / `mx-auto`) and remove conflicting margins/padding. (30m)
- [ ] 2.2 If hero markup is in a shared component (src/app/components/hero/hero.component.html), apply the same Tailwind adjustments there and update corresponding styles in the .scss file. (30m)
- [ ] 2.3 Verify that NgOptimizedImage (if used) or <img> has classes `object-cover object-center` and appropriate width/height attributes for mobile. (15m)

## Phase 3: Navigation Tab Accessibility & Scrolling

- [x] 3.1 Add horizontal scrolling utilities to the nav container in src/app/pages/mociones/mociones.component.html: `overflow-x-auto whitespace-nowrap no-scrollbar` and ensure tab items use `inline-block` / `inline-flex`. (20m)
- [x] 3.2 Adjust CSS utilities for tab buttons to include adequate touch targets (min-height/py and px) in src/app/pages/mociones/mociones.component.html / .scss. (20m)
- [x] 3.3 Review sliding indicator implementation in src/app/pages/mociones/mociones.component.ts or src/app/components/tabs/tabs.component.ts — determine if indicator width/transform is percentage-based; if so, switch logic to calculate pixel widths/transforms (use getBoundingClientRect on tab elements). (45m)
- [x] 3.4 Implement pixel-based indicator update in the tab controller file and ensure transitions use `width: px` and `transform: translateX(px)` with smooth duration (e.g., 250ms). (45m)
- [x] 3.5 Remove flex-1 on mobile tab buttons (replace with md:flex-1) to comply with spec requirement that tabs MUST NOT use flex-1 on mobile. (5m)

## Phase 4: Integration & Wiring

- [ ] 4.1 Wire any changed component inputs/outputs (e.g., activeIndex) in src/app/pages/mociones/mociones.component.ts and update tests/comments. (25m)
- [ ] 4.2 Run a local dev server (manual) and exercise the /mociones page to validate changes (manual step, no automated tests). (15m)

## Phase 5: Verification (Manual QA)

- [ ] 5.1 Visual check at mobile widths (320px, 375px, 412px, 428px): hero centered; no horizontal overflow; tabs scroll horizontally and first/last tabs reachable. (20m)
- [ ] 5.2 Confirm all 7 tabs are present, tappable, and that the sliding indicator aligns with the active tab on tap and on programmatic change. (20m)
- [ ] 5.3 Verify keyboard accessibility: tabs reachable via Tab, arrow keys move focus, and focus styles are visible. (20m)

## Phase 6: Cleanup & Documentation

- [x] 6.1 Add a short comment in the modified files explaining the pixel-based indicator decision and reference design.md. (10m)
- [x] 6.2 Update openspec/changes/fix-motions-layout-mobile/state.yaml with task status when complete (or leave placeholder). (10m)

---

Estimated total: ~5h 10m (split into small tasks — each ≤2h)
