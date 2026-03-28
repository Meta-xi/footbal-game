# Tasks: Fix /mociones tab layout and active tab styling

## Phase 1: Foundation (Investigation / Review)

- [x] 1.1 Inspect `src/app/features/motions/motions.component.ts` — verify classes on the `<nav>` container (look for `overflow-x-auto`, `no-scrollbar`, `whitespace-nowrap`) (15m)
- [x] 1.2 Inspect `src/app/features/motions/motions.component.ts` — list classes applied to each tab `button` (look for `flex-1`, `md:flex-1`, `flex-shrink-0`, responsive prefixes or conditional bindings) (20m)

## Phase 2: Tab Layout Adjustments

- [x] 2.1 Edit `src/app/features/motions/motions.component.ts` — remove `overflow-x-auto`, `no-scrollbar`, and `whitespace-nowrap` from the `<nav>` container so tabs can be laid out responsively (20m)
- [x] 2.2 Edit `src/app/features/motions/motions.component.ts` — ensure each tab `button` has `flex-1` unconditionally (remove `md:` prefix if present) and keep `flex-shrink-0` (30m)
- [x] 2.3 Update any template class bindings in `src/app/features/motions/motions.component.ts` that add `md:flex-1` dynamically — replace with unconditional `flex-1` (15m)

## Phase 3: Active Tab Styling Enhancement

- [x] 3.1 Modify `src/app/features/motions/motions.component.ts` — add conditional classes on the active tab `button` (e.g., `brightness-110 drop-shadow-lg`) using Angular class bindings or computed class string (20m)
- [x] 3.2 Modify `src/app/features/motions/motions.component.ts` — add conditional classes on the active tab `img` (e.g., `filter brightness-125 drop-shadow-md drop-shadow-cyan`) so the icon shows color/glow when active (20m)
- [x] 3.3 Update `src/app/features/motions/motions.component.ts` or Tailwind utility usage if necessary to ensure the new classes render correctly and respect `prefers-reduced-motion` (15m)

## Phase 4: Sliding Indicator Logic Review / Adjustment

- [x] 4.1 Review `updateIndicatorPosition()` in `src/app/features/motions/motions.component.ts` — confirm calculation uses equal distribution: indicator width = `nav.offsetWidth / N` and left = `index * indicatorWidth`; adjust if current logic relies on measured tab widths (30m)
- [x] 4.2 Review `scrollToActiveTab()` in `src/app/features/motions/motions.component.ts` — make it a no-op when the `<nav>` is not scrollable (i.e., if overflow removed or `scrollWidth <= clientWidth`) to avoid unintended scrolling (20m)
- [x] 4.3 Run a small manual check after changes: toggle active index programmatically and observe indicator movement in browser devtools; tweak math if off-by-one or subpixel rounding issues appear (25m)

## Phase 5: Verification (Manual Visual QA)

- [x] 5.1 Manual visual check on mobile widths (320px, 375px, 412px, 428px) — confirm all 7 tabs are visible simultaneously and layout is stable (25m)
- [x] 5.2 Confirm active tab styling is visually distinct (button glow/brightness and icon glow) and that focus/keyboard states still meet accessibility (WCAG AA) (20m)
- [x] 5.3 Verify sliding indicator aligns with active tab center and moves smoothly between tabs; confirm no scroll jump occurs (15m)

## Phase 6: Documentation & Cleanup

- [x] 6.1 Update `openspec/changes/fix-motions-tab-layout-active-style/design.md` (notes section) with the final decisions made (classes removed/added and indicator math) (10m)
- [x] 6.2 Add a short inline code comment in `src/app/features/motions/motions.component.ts` next to `updateIndicatorPosition()` explaining the equal-width assumption and why `scrollToActiveTab()` is guarded (5m)
 - [x] 6.2 Add a short inline code comment in `src/app/features/motions/motions.component.ts` next to `updateIndicatorPosition()` explaining the equal-width assumption and why `scrollToActiveTab()` is guarded (5m)

Archive:

- Archive folder: `openspec/changes/archive/2026-03-27-fix-motions-tab-layout-active-style/`
- Archive includes: proposal.md, specs/ui/spec.md (merged into main), design.md, tasks.md, verify-report.md, state.yaml

---

Estimated total: 285 minutes (~4.75 hours)
