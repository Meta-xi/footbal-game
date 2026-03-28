# Exploration: Motions Component UI Issues (`fix-motions-ui-20260327`)

## Problem Statement
1. Console error: `NG0203: effect() can only be used within an injection context... at motions.component.ts:331:5`
2. Main image (`motions/main/mociones.webp`) loads successfully but is not visible (possible CSS issue).
3. Mission tabs (Whatsapp, Facebook, TikTok, Youtube, DailyReward) are not displaying or rendering incorrectly.

## Current State
- `MotionsComponent` loads a hero image, tab navigation, and main content sections.
- Uses Angular signals for state, `NgOptimizedImage` for images, and a `MotionsService` for logic.
- The main image asset exists and loads but is possibly hidden/stylistically invisible (CSS).
- The tab bar is built using `@for (tab of missionTabKeys; ...)`, with tab keys fetched from service via `getMissionTabKeys()`.
- Tabs array in service is: `["Daily", "Whatsapp", "Facebook", "Tiktok", "Telegram", "Youtube", "History"]`
- Tailwind and custom classes are heavily used for layout/visibility/styling.
- `effect()` is called in `ngOnInit` (line 331), outside of constructor or correct injection context.

## Affected Areas
- `src/app/features/motions/motions.component.ts` — UI logic, image & tab rendering, signal/effect usage
- `src/app/features/motions/motions.service.ts` — Source of missionTabKeys, signals, and business logic
- `public/motions/main/mociones.webp` — image verified, present in assets

## Root Causes Identified
### 1. NG0203 `effect()` Error
- **Symptom:** effect() call in `ngOnInit()` triggers NG0203 error due to being called outside the correct injection context.
- **Root Cause:** Per Angular's signal API, `effect()` must be used inside constructor or injected factory, *not* in lifecycle hooks like `ngOnInit`.
  
### 2. Main Image Invisible
- **Symptom:** `/motions/main/mociones.webp` loads (verified) but visually not present.
- **Findings:**
    - The `<img ngSrc="motions/main/mociones.webp">` is conditionally rendered when `!imageError()`.
    - The wrapping div is `w-24 h-32`, and image has `object-contain`, correct sources, and z-index 10.
    - No obvious Tailwind `hidden` or zero-dimension, but may be affected by parent/ancestor stacking, overflow, or low opacity. The complex glassmorphic/blurred backgrounds could obscure faint assets.
    - The absence of Tailwind class conflicts, but z-index or backdrop/opacity stack is suspect.

### 3. Tabs Not Showing/Rendering
- **Symptom:** Mission tab keys (Whatsapp, Facebook, etc.) not rendering or are invisible.
- **Findings:**
    - `missionTabKeys` is populated (`['Daily', 'Whatsapp', ...]`), fetched from service.
    - Tab rendering loop and button structure appear correct.
    - Tabs’ style uses `flex-1`, rounded, and z-index: could be collapsed if outer nav/parent has overflow/clipping or flex layout issues.
    - If keys or icons logic is mismatched, images (`getTabIcon(tab)`) may produce blank or missing src, but structure would still render blank buttons.
    - CSS or layout may 'squash' tab bar depending on content above/below.

## Evidence
- Error: `NG0203` trace points to `effect()` at `motions.component.ts:331:5` (confirmed in code, called in `ngOnInit`).
- Tab loop and tab keys: code and signal flow reviewed — service and getter look correct.
- Image: Asset is present, referenced as `motions/main/mociones.webp` (Angular would resolve from `public/`).
- Styles: No `hidden`, zero height/width, `z-10` is correct, but may be lower priority than outer z-index, or image may be lost in bright/blurred backgrounds.

## Approaches

1. **Move `effect()` to Constructor**
   - Move the problematic `effect()` from `ngOnInit()` to the component constructor, where signal injection context is guaranteed.
   - Pros: Complies with Angular signals API, error disappears.
   - Cons: If subscription to error state requires DOM presence, a minor logic tweak may be needed, but most cases are fine.
   - Effort: Low

2. **Inspect and Adjust Image Styles/Z-Index**
   - Add temporary `border`, `bg-black/50`, or higher `z-20` to the hero image div to force visualization and isolate stacking/opacity issues.
   - Pros: Quickly reveals if element is in DOM but hidden, or rendered underneath overlays.
   - Cons: May require tweaking parent containers if compositing/overflow/scroll/flex stacking causes hiding.
   - Effort: Low-Medium

3. **Debug Tab Nav Flex Layout**
   - Use devtools to inspect computed layout for nav and button elements; ensure that flex/overflow and at least one tab renders.
   - Check if `missionTabKeys` reliably contains valid keys in runtime. Add debug output if dynamic.
   - Adjust `p-1.5`, `h-11`, and give tab buttons min-width as needed for mobile.
   - Pros: Uncovers CSS/layout bugs quickly.
   - Cons: If key or icon logic is mismatched, fallback text/icons should be added for clarity.
   - Effort: Low

## Recommendation
- **Move `effect()` subscription to constructor.**
- Add temporary highlighting/walls to hero image container and nav bar for visual debugging.
- Check that `missionTabKeys` and tab loop output DOM nodes (add test content if tab not found).
- In CSS, temporarily increase `z-index`/opacity and reduce glass background blur values to make layout debugging easier.
- If images or icons are blank, validate `getTabIcon(tab)`.

## Risks
- Some layout issues may be device/screen-size dependent due to flex and glass styles.
- If core layout is changed (e.g. by increasing z-indices), may have side effects on mobile overlays elsewhere.
- Changing effect() context must not break other signal-driven state.

## Ready for Proposal
Yes — root causes identified and suggested fixes are minimally invasive.
