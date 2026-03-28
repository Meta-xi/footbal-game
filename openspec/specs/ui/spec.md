%s

# Delta for UI/Motions Tab Navigation

## ADDED Requirements

### Requirement: Equal-Width Tab Distribution

The system MUST display all 7 mission tabs with equal width distribution across all viewport sizes, eliminating horizontal scrolling.

**Rationale**: Current implementation uses `md:flex-1` (equal width on desktop only) and `min-w-[56px]` (intrinsic width on mobile), causing tabs to be too narrow on small screens and requiring horizontal scrolling. This violates the mobile-first design principle.

#### Scenario: User views tabs on mobile viewport

- GIVEN the user navigates to the `/mociones` route on a mobile device (viewport width < 768px)
- WHEN the tab navigation renders
- THEN all 7 tabs MUST be simultaneously visible within the viewport width
- AND each tab button MUST have equal width (`flex-1` applied)
- AND no horizontal scrolling MUST be required

#### Scenario: User views tabs on tablet/desktop viewport

- GIVEN the user navigates to the `/mociones` route on a tablet or desktop (viewport width >= 768px)
- WHEN the tab navigation renders
- THEN all 7 tabs MUST be simultaneously visible within the viewport width
- AND each tab button MUST have equal width (`flex-1` applied)
- AND the layout MUST remain visually consistent with mobile

### Requirement: Enhanced Active Tab Visual Feedback

The system MUST provide distinct visual feedback for the active tab using color accent, subtle glow, and the existing sliding indicator.

**Rationale**: Current implementation only shows the active tab via the sliding glass indicator, which may not be visually prominent enough for quick identification. Enhanced styling improves usability and aligns with the Liquid Glass design system.

#### Scenario: User selects a tab

- GIVEN the user is on the `/mociones` route
- WHEN the user taps or clicks on any tab button
- THEN the active tab MUST apply a cyan color accent to the icon (`opacity-100` and optional `filter brightness(1.2)`)
- AND the active tab MUST display a subtle glow effect (`shadow-lg` or `text-shadow`)
- AND the sliding glass indicator MUST animate smoothly to align with the active tab
- AND the inactive tabs MUST remain visually subdued (`opacity-30`)

#### Scenario: Active tab styling remains visible during scroll

- GIVEN the user has selected a tab and scrolls the page content
- WHEN the tab navigation remains in view
- THEN the active tab styling (color accent, glow, indicator) MUST persist
- AND the indicator MUST remain correctly aligned with the active tab button

## MODIFIED Requirements

### Requirement: Tab Button Layout Classes

The tab button layout classes MUST be updated from viewport-dependent flex to consistent equal-width distribution.

**(Previously: `md:flex-1 h-11 min-w-[56px]` — equal width on desktop only, intrinsic width on mobile)**

**New behavior**: Apply `flex-1` unconditionally to all tab buttons across all viewports. Remove `min-w-[56px]` to prevent content-based sizing.

#### Scenario: Tab button classes updated

- GIVEN the motions component template is loaded
- WHEN the tab button elements render
- THEN each button MUST have `flex-1` class applied
- AND `min-w-[56px]` MUST be removed
- AND `md:flex-1` prefix MUST be removed (now unconditional)

### Requirement: Tab Navigation Container Scroll Behavior

The tab navigation container MUST NOT allow horizontal scrolling.

**(Previously: `overflow-x-auto` enabled horizontal scrolling for tabs that exceeded viewport width)**

**New behavior**: Remove `overflow-x-auto` since equal-width distribution ensures all tabs fit within viewport.

#### Scenario: Horizontal scrolling removed

- GIVEN the user views the tab navigation on any viewport size
- WHEN the tabs render
- THEN the navigation container MUST NOT display a horizontal scrollbar
- AND the `overflow-x-auto` class MUST be removed from the `<nav>` element
- AND the `whitespace-nowrap` class MAY remain for text content but MUST NOT cause overflow

## Technical Notes

### Files Affected
- `src/app/features/motions/motions.component.ts` — Template section (lines 43-68)

### Implementation Details
1. **Tab Button Classes**: Change from `md:flex-1 h-11 min-w-[56px]` to `flex-1 h-11`
2. **Nav Container**: Remove `overflow-x-auto` from the `<nav #tabsNav>` element
3. **Active Tab Styling**: Add conditional classes for active state:
   - Icon brightness: `[class.brightness-110]="activeTab() === tab"`
   - Optional glow: `[class.shadow-cyan-500/50]="activeTab() === tab"` or similar
4. **Indicator Logic**: Existing `indicatorX()` and `indicatorWidth()` logic remains unchanged (already pixel-based using `offsetLeft` and `offsetWidth`)

### Design System Alignment
- Accent color: `cyan-500` (aligns with existing `border-cyan-500/30` on nav container)
- Glow effect: Use subtle shadow or text-shadow with cyan tint
- Preserve existing `lg-float`, `lg-bubble`, and liquid glass classes

### Edge Cases
- **Very small viewports** (< 320px): Tabs will become narrow but remain equal-width and visible
- **Accessibility**: Focus states (`focus:ring-2 focus:ring-cyan-500/40`) remain unchanged
- **RTL layouts**: `flex-1` works correctly in RTL; no special handling needed

(End of merged delta)
