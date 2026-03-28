## Exploration: Motions Tab Layout and Active Tab Style Issues

### Current State
On the `/mociones` (Motions) route, the UI displays a horizontal navigation bar with 7 tabs (Daily, Whatsapp, Facebook, TikTok, Telegram, Youtube, History). The navigation bar is implemented as a `<nav>` element with TailwindCSS classes:

```
<nav #tabsNav class="relative bg-white/5 backdrop-blur-3xl rounded-full p-1.5 flex items-center border border-cyan-500/30 shadow-2xl accent-cyan-bg-alt overflow-x-auto whitespace-nowrap no-scrollbar px-1.5 -mx-1.5">
```

Each tab button uses:
```
<button #tabBtn (click)="setActiveTab(tab)"
  class="md:flex-1 h-11 min-w-[56px] rounded-full flex items-center justify-center group active:scale-95 transition-all duration-300 relative z-10 focus:ring-2 focus:ring-cyan-500/40 focus:outline-none flex-shrink-0">
```

- On **mobile**, the tabs are sized by their intrinsic content with `min-w-[56px]`, causing tabs to overflow and a horizontal scrollbar appears.
- The navigation bar uses `overflow-x-auto whitespace-nowrap`, so tabs do not wrap and can scroll out of view if too many.

The active tab is indicated by a sliding glass indicator:
```
<div class="absolute inset-1.5 z-0 pointer-events-none">
  <div class="h-full bg-white/10 backdrop-blur-md rounded-full border border-white/20 ..."
    [style.width.px]="indicatorWidth()"
    [style.transform]="'translateX(' + indicatorX() + 'px)'">
  </div>
</div>
```
As well as via opacity/scale on the tab icon:
```
<img ... [class.opacity-30]="activeTab() !== tab" [class.opacity-100]="activeTab() === tab" [class.scale-110]="activeTab() === tab">
```

### Affected Areas
- `src/app/features/motions/motions.component.ts` — Navigation bar and tab button styles; indicator logic
- `src/app/features/motions/motions.service.ts` — Provides the 7 `missionTabKeys`

### Root Causes Identified
#### Layout: 
- With 7 tabs, intrinsic size + `min-w-[56px]` makes total width ~392px+ (tabs + gaps), so on most mobile screens (375-430px wide), horizontal scrolling is inevitable.
- The use of `overflow-x-auto` and `whitespace-nowrap` prevents wrapping; tabs are simply pushed outside the viewport.

#### Active Tab Style:
- A sliding indicator is absolutely positioned using the pixel offset of the active tab, but because tabs are of intrinsic width and sometimes scroll, the indicator can appear misaligned ("descolocado"), especially if user scrolls quickly or resizes.
- The tab icon styling uses scaling and changing opacity, but there is no extra treatment (e.g., font color, underline) for clear active feedback.

### Evidence
- Navigation bar:
  ```html
  <nav ... class="... flex items-center ... overflow-x-auto whitespace-nowrap ...">
  ```
- Tab button:
  ```html
  <button ... class="md:flex-1 ... min-w-[56px] ... flex-shrink-0">
  ```
- Indicator:
  ```html
  <div class="absolute inset-1.5 ..."><div ... [style.transform]="'translateX(' + indicatorX() + 'px)'"></div></div>
  ```
- 7 tab keys set statically in service

### Approaches
1. **Fit All Tabs with Equal Flex Widths**
   - Set `flex-1` for all tab buttons (not just `md:` breakpoint), so 7 tabs always divide available width. Remove `min-w-[56px]` or reduce for extra-small screens.
   - Pros: All tabs visible, no scrolling. Indicator width/position is always accurate. Clean, simple.
   - Cons: Tabs become narrower on small screens (each ~14-16% width), icons may touch or crowd with long tab names.
   - Effort: Low

2. **Responsive Fixed Width, Allow Wrapping**
   - Make tab buttons a fixed (smaller) width, and allow `flex-wrap` on the container for ultra-small screens (two rows).
   - Pros: No scrolling, tab size stays larger, labels readable.
   - Cons: Two-row tab bars break motion conventions, not strictly liquid-glass single-row.
   - Effort: Medium

3. **Reduce Tab Padding & Icon Size, Keep Scroll**
   - Keep current scroll, but further reduce min/tab width, padding, and icon size so 7 tabs fit on most mobile screens.
   - Pros: Minimal change, keeps larger hit area.
   - Cons: On smallest screens may still require scroll, some tabs may be harder to tap, still prone to indicator misalignment due to scroll position.
   - Effort: Low

#### Active Tab Indicator Approaches
A. **Synchronize Indicator Logic** — Refactor so indicator always matches active tab and is not affected by scroll offset (if scrolling is removed, issue disappears).
B. **Enhanced Active Tab Feedback** — Add color accent (e.g., text-cyan-400), font weight, or bottom-outline for active tab, in addition to the indicator and icon scaling.

### Recommendation
- **For Tab Layout:** Approach 1 (All Tabs flex-1, no scroll, remove min-w) is preferred. On mobile, make tab buttons `flex-1` (not only from `md:` breakpoint). All 7 tabs will fit in one row, tabs will be slimmer but readable due to icons. This also guarantees the indicator stays aligned, removing the most common cause for "descolocado".
- **For Active Tab Style:** Combine A + B. With fixed non-scroll tabs, indicator will be always in place. Strengthen the active tab visually: accent color on icon and/or text, bolder font, and possibly a soft glow or underline beneath the active tab.

### Risks
- On extremely small screens, tabs may be smaller than desired; in this case, icons could be reduced further or abbreviate tab labels.
- If in the future more tabs are added, this solution will need to be re-evaluated.

### Ready for Proposal
Yes — both tab layout and active style issues are understood, and a clear path forward is proposed.
