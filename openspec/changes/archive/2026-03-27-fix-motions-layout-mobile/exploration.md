## Exploration: Motions Layout Issues – Hero Image Centering & Tab Visibility on Mobile

### Current State
- The `/mociones` (Motions) route features a hero image positioned in an absolutely placed `<div>` on the top right of the hero section. On mobile, this image appears right-aligned and not center.
- The tab navigation (7 tabs: Daily, Whatsapp, Facebook, TikTok, Telegram, Youtube, History) is visually presented as a horizontal nav bar with glassmorphic styling. On mobile, only 6 tabs are accessible/visible; the 7th tab (History) is hidden/cut off.

### Affected Areas
- `src/app/features/motions/motions.component.ts` (inline HTML & styles):
  - Hero image and its wrapper (lines 23–41, lines 24–38 are especially relevant)
  - Navigation bar: `<nav>` for tabs (lines 43–66)
  - No separate .scss/css for this component, only global & inline styles used.
- `src/styles.scss` (theme, glass components, and potential helpers but not directly responsible for these bugs)

### Evidence
#### Hero Image
```html
<div class="flex flex-col items-start md:items-center relative py-0 -mb-1.5">
  <div class="absolute top-0 right-0 mt-4 mr-4 z-10 w-24 h-32 group">
    <!-- ... -->
    <img ngSrc="motions/main/mociones.webp" ... class="...">
  </div>
  <div class="w-24 h-32 invisible"></div>
</div>
```
- The image is inside an absolutely positioned container `absolute top-0 right-0 mt-4 mr-4`, which pins it to the right.
- The invisible `<div>` attempts to preserve vertical spacing but does not help with centering.

#### Tabs/Nav
```html
<nav class="relative bg-white/5 backdrop-blur-3xl rounded-full p-1.5 flex items-center border border-cyan-500/30 shadow-2xl accent-cyan-bg-alt">
  @for (tab of missionTabKeys; track tab) {
    <button ... class="flex-1 h-11 min-w-[56px] rounded-full flex items-center justify-center ...">
      <img ... />
    </button>
  }
</nav>
```
- The nav uses `flex` and `items-center` but **no horizontal scrolling, no flex-wrap**. Each button is `flex-1 min-w-[56px]`, causing all buttons to try to fit in a single row. With 7 tabs on small screens, tab widths get squashed, or the container clips overflow.

### Approaches
1. **Hero Image Centering**
   - Replace `absolute top-0 right-0 mt-4 mr-4` with `mx-auto` centering and remove absolute positioning.
   - Use flex/grid in the parent to center the inner image container with `items-center justify-center`.
   - Pros: Simple, consistent across breakpoints; follows mobile-first.
   - Cons: May lose the intended desktop right-aligned effect unless responsive logic is added.
   - Effort: Low.

2. **Tabs: Horizontal Scroll**
   - Add `overflow-x-auto` and `no-scrollbar` to the `<nav>` container. Set `flex-nowrap` to prevent wrapping, remove `flex-1` from tab buttons, and use fixed `min-w` for each button (e.g., `min-w-[56px]`).
   - Pros: All tabs always accessible on mobile; swipe to scroll feels native.
   - Cons: Requires tuning for desktop vs mobile, but low risk.
   - Effort: Low/Medium.

3. **Tabs: Decrease Tab Size**
   - Shrink the button sizes or icon sizes so all fit on mobile in one row.
   - Pros: No scroll needed; clean.
   - Cons: Tabs may become too small to tap (breaks thumb ergonomics/accessibility); not robust if more tabs are added later.
   - Effort: Medium.

4. **Tabs: Overflow Menu**
   - Add a "More" dropdown for overflowed tabs.
   - Pros: Always fits; intuitive for power users.
   - Cons: Less discoverable; more complex.
   - Effort: Medium/High.

### Recommendation
- **Hero Image:** Remove absolute/right-0 on mobile, use centered flex/grid layout. For desktop, optionally apply right alignment using responsive Tailwind classes (`md:absolute md:right-0 ...`).
- **Tabs:** Use horizontal scrolling (`overflow-x-auto flex-nowrap` on nav, `min-w-[56px]` per button, remove `flex-1`). This is the most robust, easiest on mobile, and already widely used. Optionally, restore `flex-1` on `md:` and up for desktop view.

### Risks
- Hero centering may impact current desktop look. Responsive classes can mitigate.
- Manual horizontal scrolling may reduce discoverability for users who expect arrows or fade-out cues; solution is to carefully preserve visible cues (see design guidelines in AGENTS.md).

### Ready for Proposal
Yes. Ready to proceed with spec and design.

---

#### Root Causes
- **Hero Image:** Absolute positioning (`absolute top-0 right-0 ...`) pins image right, not center. No centering logic for mobile.
- **Tabs:** No horizontal scroll, plus use of `flex-1`, causes tabs to be squished and/or hidden on small screens.

#### Possible Fixes
- **Hero:** Use centered flex/grid, with `md:` classes to restore absolute on desktop.
- **Tabs:** Enable scroll, fix button widths, and remove `flex-1` to allow natural tab sizing. Tune responsive logic as needed.

#### Evidence
- See code snippets above.
