# Design: Fix Motions Tab Layout and Active Tab Styling

## Technical Approach

Apply equal-width tabs (flex-1) unconditionally and remove horizontal scrolling from the tab nav. Enhance active-tab feedback by combining a cyan accent with subtle brightness and a soft drop shadow/glow on the icon and button surface. Keep the existing opacity and scale transitions; add a robust, pixel-aligned indicator strategy that uses either the active button geometry or a computed equal-column fallback.

## Architecture Decisions

### Decision: Tab Layout — unconditional flex-1
**Choice**: Make every tab button `flex-1` at all breakpoints and remove the nav's `overflow-x-auto`/whitespace-nowrap classes.
**Alternatives considered**: Keep intrinsic width with `min-w-[56px]` and scroll; switch to a responsive breakpoint to enable scrolling only on very small widths.
**Rationale**: Proposal requires all 7 tabs visible simultaneously and equal widths simplify visual rhythm and indicator math. Simpler layout reduces layout thrash and edge-case offsets.

**Implication / Mitigation**: On very narrow screens 7 equally sized tabs may drop below the 44px touch minimum. Mitigation steps:
- Reduce horizontal padding and icon size in the tab button (e.g., remove extra px and use 20–22px icons).
- If nav.clientWidth < 7 * 44, enable a responsive fallback that reintroduces `overflow-x-auto` (CSS breakpoint or runtime check) and reduce per-tab min width.

### Decision: Active Tab Styling — accent + glow + preserved transitions
**Choice**: Add conditional Tailwind classes to active tab elements: for the button container apply `brightness-110` and a subtle `drop-shadow-lg` (or a `[drop-shadow]` with cyan tint). For icon/img apply `filter brightness-110 drop-shadow-[0_6px_20px_rgba(0,210,255,0.22)]` and, where possible, prefer SVGs using `currentColor` so `text-cyan-400` can tint icons.
**Alternatives considered**: Rely only on existing opacity/scale transitions; use a thick bottom border instead of glow.
**Rationale**: Glow + brightness aligns with Liquid Glass tokens and provides stronger affordance without breaking the sliding indicator. Existing `[class.opacity-30|100]` and `scale-110` remain; the new styles layer on top for clearer focus/active feedback.

## Component Structure & Styling

Files to modify

| File | Action | Description |
|---|---:|---|
| src/app/features/motions/motions.component.ts | Modify | Remove scroll-related classes from `<nav>`; make tab `<button>` class include `flex-1` unconditionally and remove `min-w-[56px]` and `flex-shrink-0`. Add conditional classes to the tab `<img>` for brightness/glow. Minor indicator updates. |

Concrete changes (examples):
- Nav container: remove `overflow-x-auto whitespace-nowrap no-scrollbar -mx-1.5` and keep `relative bg-white/5 backdrop-blur-3xl rounded-full p-1.5 flex items-center border border-cyan-500/30`.
- Tab button (replace current class):
  `class="flex-1 h-11 rounded-full flex items-center justify-center group active:scale-95 transition-all duration-300 relative z-10 focus:ring-2 focus:ring-cyan-500/40 focus:outline-none"`
- Img within tab: add conditional classes/bindings
  `[class.brightness-110]="activeTab() === tab" [class.drop-shadow-lg]="activeTab() === tab" [class.opacity-30]="activeTab() !== tab" [class.opacity-100]="activeTab() === tab" [class.scale-110]="activeTab() === tab"`

Notes on icons: raster PNGs cannot be color-tinted by `text-` utilities. Prefer converting tab icons to monochrome SVGs that use `currentColor` so the parent button can receive `text-cyan-400` when active. If conversion is not possible, the CSS filter+drop-shadow approach will produce acceptable accenting.

## Interactions

### Sliding Indicator
The existing indicator logic that uses activeButton.offsetWidth and offsetLeft will continue to work. With equal-width tabs there is an opportunity to simplify:

- Preferred: compute column width as `nav.clientWidth / N` and set `indicatorWidth = columnWidth` and `indicatorX = columnWidth * activeIndex` — this avoids reading many element bounds and is robust to subpixel layouts.
- Fallback: keep current `offsetWidth/offsetLeft` approach but switch to `getBoundingClientRect()` for sub-pixel accurate measurements when needed. Keep listening to resize events; remove scroll handling if `overflow-x-auto` is not present, but leaving the scroll listener is harmless (scrollLeft will remain 0).

### Scroll behavior
Because horizontal scrolling is removed, `scrollToActiveTab()` can be simplified to a no-op. Keep the function but make it early-return when `nav.scrollWidth <= nav.clientWidth` so the API remains safe.

## Testing Strategy

Manual acceptance tests (no automated tests per restrictions):
- Verify on standard mobile viewport (375px width) all 7 tabs are visible and have tappable target ≥ 44px.
- Verify active tab shows combined opacity+scale+brightness+drop-shadow and sliding indicator aligns pixel-perfect.
- Verify fallback: when container too narrow, runtime enables scrolling and layout matches previous behavior.

## Migration / Rollout

No data migration required. Deploy as a small UI change behind a quick visual QA. If issues arise, rollback by reintroducing `overflow-x-auto` and removing `flex-1`.

## Open Questions
- Should we convert tab PNG icons to monochrome SVGs to allow color-tinting via `currentColor`? (Recommended)
- Exact cyan tint token: use `text-cyan-400` or `text-cyan-500`? Use `text-cyan-400` to match existing accents in UI tokens.

## Notes

- Removed `overflow-x-auto`, `whitespace-nowrap`, `no-scrollbar`, and `-mx-1.5` from `<nav>` container.
- Removed `px-1.5` extra padding (kept `p-1.5`).
- Changed tab button classes from `md:flex-1 h-11 min-w-[56px] flex-shrink-0` to `flex-1 h-11` (unconditional).
- Added conditional classes on active tab button: `brightness-110` and `drop-shadow-lg`.
- Added conditional classes on active tab icon: `brightness-125` and `drop-shadow-lg`.
- Updated indicator calculation to equal column width: `indicatorWidth = (nav.clientWidth - 12) / N`, `indicatorX = columnWidth * activeIndex`.
- Guarded `scrollToActiveTab()` with `if (nav.scrollWidth <= nav.clientWidth) return;`.
- Added inline comments explaining equal-width assumption and guarded scroll.

---

Prepared for: openspec/changes/fix-motions-tab-layout-active-style
