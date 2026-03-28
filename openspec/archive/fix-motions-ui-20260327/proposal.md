# Proposal: Fix Motions Component UI Issues

## Intent
The `/mociones` route has several UI issues affecting functionality and appearance. Fixing these issues will improve the user experience and ensure the route functions as intended.

## Scope

### In Scope
- Move `effect()` call in `motions.component.ts` from `ngOnInit()` to the constructor.
- Adjust CSS (TailwindCSS) in `motions.component.ts` to fix image positioning and z-index issues.
- Investigate and propose fixes for the tab rendering issues, including:
  - Verifying `getMissionTabKeys()` return values.
  - Confirming active tab logic.
  - Inspecting tab button styling and layout.

### Out of Scope
- Major redesigns of the `/mociones` route UI.
- Comprehensive rework of signals or state management.
- Adding new tabs or altering `MotionsService` logic beyond data consistency.

## Approach

1. **Fix NG0203 Error**:
   - Move the problematic `effect()` call from `ngOnInit()` to the constructor, ensuring it’s within a valid injection context.

2. **Image Visibility/Positioning**:
   - Add temporary debugging styles (e.g., `border`, `z-index`, `opacity`) to identify the root cause.
   - Correct stacking context with appropriate `z-index` values for the hero image.

3. **Tab Display Issues**:
   - Use devtools to inspect layout and verify `missionTabKeys` values.
   - Add minimum dimensions (`min-w`) and padding to ensure tabs render correctly.
   - Validate `getTabIcon()` logic for tabs.
   - Apply fallback styles/icons in case data is missing.

## Affected Areas

| Area                           | Impact   | Description                                                             |
|--------------------------------|----------|-------------------------------------------------------------------------|
| `src/app/features/motions/motions.component.ts` | Modified | Adjust `effect()` call and update CSS for image and tabs.              |
| `src/app/features/motions/motions.service.ts`  | Investigate | Verify `getMissionTabKeys()` behavior.                                 |
| `public/motions/main/mociones.webp`            | Investigate | Ensure image visibility and proper positioning.                        |

## Risks

| Risk                                | Likelihood | Mitigation                                      |
|-------------------------------------|------------|------------------------------------------------|
| Layout changes breaking elsewhere  | Medium     | Cross-test on multiple devices and screen sizes.|
| Signal changes affecting state flow| Low        | Minimal disruption expected within constructor.|
| Side effects on tab styling         | Medium     | Incrementally fix tab layout with CSS debugging|

## Rollback Plan
- If moving `effect()` causes new issues, revert to `ngOnInit()` and analyze injection context alternatives.
- Revert CSS changes individually to diagnose specific conflicts.
- Restore any modified `MotionsService` logic.

## Dependencies
- `NgOptimizedImage` for image optimization.
- TailwindCSS for layout and styling.

## Success Criteria
- [ ] `NG0203` error no longer occurs.
- [ ] Hero image is visible and positioned in the top-right corner.
- [ ] Tabs render correctly with appropriate icons and styles.
- [ ] No regressions in unrelated components or layouts.
