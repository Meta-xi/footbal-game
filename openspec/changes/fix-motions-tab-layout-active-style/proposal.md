# Proposal: Fix Motions Tab Layout and Active Tab Styling

## Intent
The `/mociones` route requires improvements to the tab layout and active tab styling to address usability and aesthetic issues. Specifically, all 7 tabs should be visible simultaneously without horizontal scrolling, and the active tab should provide clearer visual feedback consistent with the liquid glass aesthetic.

## Scope

### In Scope
- Equal-width (`flex-1`) layout for the 7 tab buttons across all viewports.
- Removal of horizontal scrolling for tab navigation.
- Enhanced active tab styling combining a color accent, glow effect, and current sliding indicator.
- Refactoring the indicator logic for precise alignment.

### Out of Scope
- Major redesign of tab icons or labels.
- Changes to the sliding glass indicator beyond alignment improvements.
- Adjustments for more than 7 tabs (future scalability deferred).

## Approach
1. **Tab Layout**:
   - Modify the tab buttons to use `flex-1` widths on all viewports.
   - Remove `min-w-[56px]` to eliminate content-based tab sizing. 
   - Ensure all 7 tabs fit within the available horizontal space regardless of screen size.

2. **Active Tab Styling**:
   - Add `text-cyan-500` or another approved accent color to active tab text/icon.
   - Apply a subtle glow (`focus:ring-2 accent-cyan/50`) or a bottom shadow for enhanced visual feedback.
   - Refactor sliding indicator (`indicatorX()` logic) to remain perfectly aligned with the active tab.

## Affected Areas

| Area | Impact     | Description                                    |
|------|------------|-----------------------------------------------|
| `src/app/features/motions/motions.component.ts`  | Modified | Tab button layout and classes, indicator logic. |
| `src/app/features/motions/motions.service.ts`    | Unchanged | References `missionTabKeys` (unchanged behavior).|

## Risks

| Risk                                 | Likelihood | Mitigation                              |
|--------------------------------------|------------|-----------------------------------------|
| Tabs may be too narrow on small screens. | Medium     | Reduce tab padding/icons if necessary.  |
| Visual inconsistency due to new active styles. | Low        | Match glow/accent to design system colors. |

## Rollback Plan
- Revert to the previous CSS styles and layout.
- Re-enable `overflow-x-auto` for tabs if the new layout does not meet usability expectations.
- Remove new styles for the active tab in favor of the original.

## Dependencies
- TailwindCSS for styling consistency.
- The existing sliding tab indicator logic for alignment enhancements. 

## Success Criteria
- [ ] All 7 tabs are visible simultaneously on standard mobile viewports without any horizontal scrolling.
- [ ] Active tab styling includes a distinctive glow and color accent, in addition to the sliding indicator.
- [ ] No misalignment or "descolocado" effects from the tab indicator.

---

This proposal outlines actionable changes addressing both the layout and styling concerns, ensuring that the tab navigation on the `/mociones` route aligns with user experience expectations and the liquid-glass aesthetic employed across the application.