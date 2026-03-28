# Proposal: Hero Image Centering & Mobile Tab Accessibility for `/mociones`

## Intent

To address mobile-first user experience (UX) issues in the `/mociones` route by centering a right-aligned hero image and ensuring all 7 navigation tabs are both visible and interactive on smaller screens.

## Scope

### In Scope
- **Hero Image Centering:**
  - Modify classes to replace absolute alignment (`right-0`) with a centered layout using `mx-auto` or flex/grid responsive adjustments.
- **Mobile Tab Accessibility:**
  - Enable horizontal scrolling in the `<nav>` container with `overflow-x-auto` and `no-scrollbar`.
  - Adjust tab button widths (`min-w-[56px]` without `flex-1`) to ensure consistent and accessible sizing.

### Out of Scope
- Adding or removing tabs from navigation.
- Desktop layouts beyond light responsive tuning where necessary.
- Alternative solutions like dropdown menus for overflowed tabs.

## Approach

1. **Hero Image Centering:**
    - Remove the `absolute`, `top-0`, `right-0`, `mt-4`, and `mr-4` classes from the hero image container.
    - Replace with flex alignment properties in the parent wrapper: `justify-center items-center` for desktop and mobile.
    - Add `responsive classes` (i.e., `md:right-0`) to maintain current desktop alignment behavior.
    - CSS changes will primarily impact inline styles in `motions.component.ts`.

2. **Mobile Tab Accessibility:**
    - Add `overflow-x-auto` and `no-scrollbar` to the `<nav>`'s class list.
    - Ensure tabs use consistent fixed `min-w-[56px]` widths, removing `flex-1` from their styles.
    - Conditionally restore `flex-1` with `md:` classes for the desktop view.
    - Test scrolling behavior on mobile devices to confirm accurate sliding tab indicator alignment.

## Affected Areas

| Area                                    | Impact     | Description                                                    |
|-----------------------------------------|------------|----------------------------------------------------------------|
| `src/app/features/motions/motions.component.ts` | Modified   | Inline styles for hero image and navigation tabs.              |
| `src/styles.scss`                       | Unchanged  | No direct changes, though theming classes for tabs are reused. |

## Risks

| Risk                                    | Likelihood | Mitigation                                                   |
|-----------------------------------------|------------|-------------------------------------------------------------|
| Hero centering affects desktop styles   | Medium     | Responsive Tailwind classes to distinguish mobile/desktop.    |
| Scrollable nav tabs reduce discoverability | Low        | Preserve visual cues like sliding indicators or fade effects. |

## Rollback Plan

- **Hero Image:** Revert styles to previous absolute positioning.
- **Tabs Visibility:** Remove `overflow-x-auto` and revert to `flex-nowrap`.
- Changes can be fully reverted by restoring the prior inline styles in `motions.component.ts`.

## Dependencies

- TailwindCSS for responsive classes (`md:`).
- Mobile device testing to ensure scrolling functionality meets expectations.

## Success Criteria

- [ ] The hero image is centered on both mobile and desktop screens.
- [ ] All 7 navigation tabs are visible, scrollable, and interactive on mobile devices.
- [ ] No visual regressions on desktop layouts.
