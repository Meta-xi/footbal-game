# UI Specification — Motions Page Mobile Layout

## Purpose

This specification defines the user interface requirements for the `/mociones` (Motions) route, specifically addressing hero image alignment and navigation tab accessibility on mobile devices. The system MUST provide a consistent, mobile-first experience that ensures all interactive elements are accessible and visually centered.

---

## Requirements

### Requirement: Hero Image Centering

The hero image (`mociones.webp`) on the `/mociones` route MUST be horizontally centered across all viewport sizes.

**Context**: The current implementation uses absolute positioning (`absolute top-0 right-0 mt-4 mr-4`) which aligns the image to the top-right corner, creating a poor mobile experience and inconsistent visual hierarchy.

**Solution**: The system SHALL replace absolute positioning with responsive flex/grid alignment that centers the image on mobile while maintaining optimal desktop presentation.

#### Scenario: Hero image displays centered on mobile viewport

- **GIVEN** a user navigates to `/mociones` on a mobile device (viewport width < 768px)
- **WHEN** the page loads and renders the hero image
- **THEN** the `mociones.webp` image MUST be horizontally centered
- **AND** the image MUST NOT be clipped or overflow the viewport
- **AND** the image MUST maintain its aspect ratio

#### Scenario: Hero image displays centered on tablet viewport

- **GIVEN** a user navigates to `/mociones` on a tablet device (viewport width 768px - 1024px)
- **WHEN** the page loads and renders the hero image
- **THEN** the `mociones.webp` image MUST be horizontally centered
- **AND** the image SHOULD scale appropriately for the viewport
- **AND** the image MUST NOT overlap other page content

#### Scenario: Hero image displays correctly on desktop viewport

- **GIVEN** a user navigates to `/mociones` on a desktop device (viewport width ≥ 1024px)
- **WHEN** the page loads and renders the hero image
- **THEN** the `mociones.webp` image MUST be horizontally centered OR aligned according to responsive design rules (`md:right-0` acceptable)
- **AND** the image MUST enhance the page layout without blocking content

---

### Requirement: Navigation Tab Accessibility on Mobile

All 7 navigation tabs in the `/mociones` route MUST be accessible and interactive on mobile devices through horizontal scrolling.

**Context**: The current layout may truncate or hide tabs beyond the viewport width on mobile screens, preventing users from accessing all navigation options.

**Solution**: The system SHALL implement horizontal scroll for the navigation container with consistent tab sizing and visual scroll indicators.

#### Scenario: All 7 tabs are accessible via horizontal scroll on mobile

- **GIVEN** a user is viewing `/mociones` on a mobile device (viewport width < 768px)
- **WHEN** the user views the navigation bar
- **THEN** all 7 tabs MUST be present in the DOM
- **AND** tabs exceeding viewport width MUST be accessible via horizontal scroll
- **AND** the navigation container MUST display `overflow-x-auto` behavior
- **AND** the scrollbar SHOULD be hidden (`no-scrollbar` class applied)

#### Scenario: Tab buttons maintain minimum touch target size

- **GIVEN** a user is interacting with navigation tabs on a mobile device
- **WHEN** the user attempts to tap a tab
- **THEN** each tab button MUST have a minimum width of 56px (`min-w-[56px]`)
- **AND** the tap target MUST be easily accessible (≥44px height per WCAG guidelines)
- **AND** tabs MUST NOT use `flex-1` on mobile (which causes uneven distribution)

#### Scenario: Sliding tab indicator aligns correctly during scroll

- **GIVEN** a user scrolls horizontally through navigation tabs
- **WHEN** the user selects a tab that requires scrolling into view
- **THEN** the sliding tab indicator MUST animate to the correct position
- **AND** the selected tab MUST scroll into the visible viewport area
- **AND** the indicator MUST remain visually aligned with the active tab

#### Scenario: Desktop viewport displays all tabs without scrolling

- **GIVEN** a user views `/mociones` on a desktop device (viewport width ≥ 768px)
- **WHEN** the navigation bar renders
- **THEN** all 7 tabs SHOULD be visible without requiring horizontal scroll
- **AND** tabs MAY use `md:flex-1` to distribute evenly across available space
- **AND** the navigation container SHOULD NOT show scroll behavior on desktop

---

## Technical Constraints

| Constraint | Requirement Level | Details |
|------------|------------------|---------|
| TailwindCSS only | MUST | No custom CSS or `@apply` directives. Use utility classes. |
| Mobile-first design | MUST | Base classes target mobile; responsive prefixes (`md:`, `lg:`) for larger screens. |
| Responsive breakpoints | MUST | Mobile: `< 768px`, Tablet: `768px - 1024px`, Desktop: `≥ 1024px` |
| Accessibility | MUST | Minimum touch target: 44px (WCAG 2.5.5). Keyboard navigation supported. |
| No layout shift | SHOULD | Hero image positioning changes MUST NOT cause cumulative layout shift (CLS). |

---

## Acceptance Summary

| Feature | Acceptance Criteria |
|---------|---------------------|
| **Hero Image Centering** | ✅ Centered on mobile, tablet, and desktop<br>✅ No overflow or clipping<br>✅ Aspect ratio preserved |
| **Tab Accessibility** | ✅ All 7 tabs accessible via scroll on mobile<br>✅ Minimum 56px width per tab<br>✅ Sliding indicator aligns correctly<br>✅ Desktop shows all tabs without scroll |

---

## Out of Scope

- Adding or removing navigation tabs
- Alternative navigation patterns (e.g., dropdown menus, hamburger menus)
- Hero image replacement or optimization (e.g., WebP conversion, lazy loading)
- Animation performance tuning beyond standard transitions

---

## References

- **Proposal**: `openspec/changes/fix-motions-layout-mobile/proposal.md`
- **Component**: `src/app/features/motions/motions.component.ts`
- **WCAG 2.1 Target Size**: [2.5.5 Target Size (Level AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
