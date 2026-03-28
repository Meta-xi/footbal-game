# Design: Fix Motions Component UI Issues (fix-motions-ui-20260327)

## Technical Approach

Small, targeted fixes: (1) move the reactive effect that watches the error signal from ngOnInit to the constructor so it is created inside a valid Angular injection context; (2) adjust Tailwind utility classes to guarantee the hero image is visible/top-right and that the tab bar has consistent sizing, stacking and interactive affordances. No new dependencies.

## Architecture Decisions

Decision: effect() Location
- Choice: Initialize the effect in the component constructor instead of ngOnInit.
- Alternatives considered: keep effect in ngOnInit and wrap with runInInjectionContext or move to a factory/provider. Rejected for scope and simplicity.
- Rationale: Angular signals' effect() may throw NG0203 if executed outside an injection context. The component constructor executes within the DI/injection context where injected signals (from MotionsService) are safe to observe. Moving the effect to the constructor is a one-line, low-risk change that satisfies the spec and prevents runtime NG0203 errors.

Decision: Minimal UI-only changes
- Choice: Only adjust Tailwind classes and z-index/shadow ordering; do not refactor service signals or tab keys logic.
- Rationale: Proposal and spec require layout fixes and data-consistency checks only; MotionsService already exposes missionTabKeys(), activeTab$, activeIndex and computed signals — use these as-is.

## Data Flow

MotionsService (signals) → MotionsComponent (reads as readonly signals) → Template

- MotionsService exposes: missionTabKeys(), activeTab$ (signal), activeIndex (computed), dailyRewards$, missions$, whatsappMissions$, error$ and toastData$.
- MotionsComponent assigns these readonly signals in the constructor: missionTabKeys = getMissionTabKeys(), activeTab = activeTab$, activeIndex = activeIndex, etc.
- Tab interaction: Template button click → component.setActiveTab(tab) → MotionsService.setActiveTab(tab) → activeTab signal updates → activeIndex computed updates → template bindings ([class.opacity-100], sliding indicator transform) react automatically.
- Image error: image element (error) handler sets component-local imageError signal → template @if(!imageError()) shows <img> else shows SVG placeholder.

## Component Structure & Styling

Hero Image Positioning
- Goal: place hero image visually at the top-right of the hero area and ensure proper stacking.
- Implementation (Tailwind utilities):
  - Make the hero container position: relative (it already is).
  - Update the image wrapper: add `absolute top-0 right-0 mt-4 mr-4 z-10` on the image wrapper element (or `self-end md:self-center` on the wrapper when preferring non-absolute layout). The deep aura (glow) should be behind the image with `absolute inset-0 z-0` and lower opacity.
  - Ensure hero container does not force centering on mobile: replace `items-center` with `items-start md:items-center` (mobile-first) so the absolute placement and top alignment are predictable.
  - z-index notes: the image should be z-10 (per spec); aura/glow z-0; tab nav and main content must have z < 10 (or use z-0/z-5) so image remains unobscured.

Tab Styling
- Existing classes (`bg-white/5`, `backdrop-blur-3xl`, `rounded-full`, `border-cyan-500/30`) are appropriate for the Liquid Glass look.
- Adjustments required:
  - Ensure each tab button keeps a minimum height of 44px: `h-11` (already present) — keep as mobile-first.
  - Add explicit `min-w-[56px]` (or `min-w-[3.5rem]`) on buttons when tabs shrink on narrow screens to avoid collapse.
  - Ensure sliding indicator calculation uses missionTabKeys.length (already used). Confirm missionTabKeys is non-empty; if empty, hide the indicator to avoid division-by-zero styling artifacts.
  - Improve focus / keyboard visibility: add `focus:ring-2 focus:ring-cyan-500/40 focus:outline-none` to tab buttons.

Class / Utility Usage
- Follow project rules: TailwindCSS only, mobile-first classes, avoid new global CSS. Use responsive prefixes (`md:`, `lg:`) for larger screens. Keep touch targets >=44px.

## Interactions

Tab Activation
- setActiveTab(tab) calls MotionsService.setActiveTab(tab) which updates the internal activeTab signal.
- The component reads activeTab$ as a readonly signal; template compares `activeTab() === tab` to toggle classes. The activeIndex() computed signal drives the sliding indicator transform: translateX(activeIndex() * 100%). This is a pure signal-based flow — no change detection callbacks required thanks to OnPush and signals.

Image Error Fallback
- image element uses (error)="imageError.set(true)" to flip the local signal.
- Template uses `@if (!imageError())` to render the <img> and `@else` to render the SVG fallback with identical dimensions and styling.
- Recommendation: optionally add (load) handler to explicitly set imageError.set(false) to recover if caching or re-render occurs.

## File Changes

| File | Action | Description |
|--|--|--|
| src/app/features/motions/motions.component.ts | Modify | Move effect() (watching error signal) from ngOnInit() into the constructor. Add minor Tailwind class tweaks for hero wrapper (absolute/top-right z-index) and add focus styles and min-width to tab buttons. |
| openspec/changes/fix-motions-ui-20260327/design.md | Create | This design document. |

## Open Questions / Risks
- If missionTabKeys is empty at runtime, the sliding indicator width computation might produce undesirable styles — guard by skipping indicator render when length === 0.
- Verify no other global layout utilities are forcing higher z-index on sibling elements (e.g., nav overlays) — cross-check in QA.

---
Ready for the tasks phase (sdd-tasks): move effect → constructor, apply Tailwind adjustments described above, and QA on mobile and tablet breakpoints.
