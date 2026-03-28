# Design: Hero Image Centering & Mobile Tab Accessibility for `/mociones`

## Technical Approach

Small, targeted UI changes in the Motions component to: (1) center the hero image on mobile while preserving desktop alignment, and (2) make the 7 navigation tabs fully mobile-accessible via horizontal scrolling while keeping the sliding indicator accurate.

Changes are limited to the component template/styles and the component class (no global style system changes). Follow Tailwind-only, mobile-first principles.

## Architecture Decisions

Decision: Center hero image
- Choice: Remove absolute top/right placement on mobile and use a centered flex layout on the hero wrapper.
- Alternatives considered: keep absolute positioning and add transform offsets per breakpoint (rejected — more brittle and harder to maintain).
- Rationale: Flex centering with responsive overrides is more robust and keeps markup simple.

Implementation (Tailwind classes):
- Parent wrapper (already `.flex flex-col items-start md:items-center ...`) — change to: `flex flex-col items-center md:items-start` if desktop previously right-aligned; or better: `flex flex-col items-center md:items-end` if desktop should keep right alignment. We will set: `items-center md:items-end`.
- Hero image container: remove `absolute top-0 right-0 mt-4 mr-4` and replace with a simple wrapper `w-24 h-32 z-10 group mx-auto md:mr-4 md:mt-4` to allow centered mobile layout and preserve desktop margin.

Decision: Make tabs horizontally scrollable and accessible
- Choice: Convert `<nav>` into a horizontal scroll container using Tailwind utilities: `overflow-x-auto whitespace-nowrap -mx-1.5 px-1.5 no-scrollbar` and render tab buttons as inline-flex items with `inline-flex` + `min-w-[56px]`.
- Alternatives: keep flex with shrink/grow and compress labels (rejected — would hide tabs or make small touch targets).
- Rationale: Horizontal scroll with consistent min-widths guarantees all 7 tabs are reachable while keeping touch targets >=44px.

Tailwind classes to add/use:
- Nav: `overflow-x-auto no-scrollbar whitespace-nowrap px-1.5 -mx-1.5` (mobile-first)
- Tabs (buttons): replace `flex-1` with `inline-flex items-center justify-center h-11 min-w-[56px] rounded-full px-3 mr-2` and add `md:flex-1 md:px-0 md:mr-0` to restore desktop layout.

Decision: Sliding indicator logic
- Choice: Keep visual indicator but change measurement strategy — compute width & translate (px) using element metrics and set inline styles (CSS variables) from the component.
- Alternatives: keep percent-based width/translate; this only works when the nav container width equals sum of equal tab widths (not the case once min-widths + scroll exist).
- Rationale: When nav scrolls and tabs have intrinsic widths, pixel-based positioning (offsetLeft/offsetWidth) is accurate. Implemented reactively with Signals + effect + ResizeObserver + scroll listener.

Implementation notes for indicator:
- Move the indicator element inside the scrollable nav so it scrolls with content and receives correct offsets.
- Expose two CSS variables on the indicator container: `--indicator-w` and `--indicator-x`.
- Update those from the component: when activeIndex(), on nav scroll, and on window/tab resize, compute:
  - const target = buttons[activeIndex];
  - const x = target.offsetLeft - nav.scrollLeft;
  - const w = target.offsetWidth;
  - then set style.setProperty('--indicator-w', `${w}px`); style.setProperty('--indicator-x', `${x}px`);
- Indicator style: `width: var(--indicator-w); transform: translateX(var(--indicator-x)); transition: transform 250ms cubic-bezier(0.2,1,0.3,1), width 250ms;`

## Component Structure & Styling

Files to modify
- src/app/features/motions/motions.component.ts — Modify template and class (refs, effects, scroll/resize handling).

Template changes (summary):
- Hero: remove absolute wrapper and replace with `div.w-24.h-32 z-10 group mx-auto md:mr-4` plus a small invisible spacer as needed.
- Nav: add `overflow-x-auto whitespace-nowrap no-scrollbar px-1.5 -mx-1.5` to `<nav>` and render tab buttons as `inline-flex` elements (no `flex-1` on mobile).
- Indicator: render as a child inside the nav (absolute positioned relative to nav content) using `absolute bottom-[4px] left-0 h-9 rounded-full pointer-events-none` and style bound to CSS vars.

Class changes (summary):
- Add `@ViewChild('tabsNav', { read: ElementRef }) navEl!: ElementRef;` and store `button` refs via template reference variables (`#tabBtn`) collected with `@ViewChildren`.
- Add effects that react to `activeIndex()` and to nav `scroll` events; use ResizeObserver to update measurements.

Class/Utility usage
- Enforce "TailwindCSS Only" — no new CSS files; minimal inline styles only for dynamic vars (CSS variables on the indicator). Respect mobile-first conventions and use `md:` to restore desktop behaviors.

## Interactions

Tab switching flow
1. User taps a tab (button). setActiveTab(tab) runs (delegates to service) and updates activeIndex() / activeTab().
2. Component effect that observes activeIndex() computes new indicator position using the corresponding button DOM rect and sets `--indicator-w` and `--indicator-x`.
3. If the target button is partially or fully out of view, the component calls `navEl.nativeElement.scrollTo({ left: target.offsetLeft - (nav.clientWidth - target.offsetWidth) / 2, behavior: 'smooth' })` to center the tab in view (optional, but recommended for discoverability). This keeps the sliding indicator and the active tab visible.
4. On manual scroll, the nav `scroll` event handler recomputes `--indicator-x` so the indicator remains aligned.

Accessibility
- Buttons keep `role="tab"`, `aria-selected` and keyboard focus support (already present via native button semantics). Ensure focus-visible styles via existing focus ring utilities.
- Maintain min touch target size (>= 44px).

## File Changes Table

| File | Action | Description |
|------|--------|-------------|
| src/app/features/motions/motions.component.ts | Modify | Update template: hero wrapper, nav classes, indicator markup; add ViewChild/ViewChildren refs and effects for indicator positioning and scroll behavior. |
| openspec/changes/fix-motions-layout-mobile/design.md | Add | This design document. |

## Open Questions
- Should tapping a tab auto-center it in the scroll viewport or only make it visible? (Design recommends auto-center for discoverability.)

## Risks
- Slight layout shift during first measurement on slow devices — mitigated by ResizeObserver + initial measurement run after view init.
- Desktop layout regressions — mitigate with `md:` overrides and visual QA.

## Next Steps
1. Implement the template and class changes in MotionsComponent as specified.
2. QA on real devices, verify indicator alignment and smooth scrolling.
3. Run accessibility checks (AXE) to ensure keyboard & focus behaviors are correct.

---

Generated by sdd-design — ready for sdd-tasks.
