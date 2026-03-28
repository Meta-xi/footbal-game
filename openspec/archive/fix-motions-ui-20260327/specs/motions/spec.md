# Delta for Motions Component UI

## MODIFIED Requirements

### Requirement: Effect Injection Context

The MotionsComponent **MUST** initialize all Angular reactive effects within a valid injection context to prevent runtime errors.

**Previously**: The `effect()` call was placed in `ngOnInit()`, which is outside the injection context, causing NG0203 errors.

**Now**: The `effect()` call **MUST** be moved to the constructor to ensure proper injection context.

#### Scenario: Effect runs without NG0203 error

- **GIVEN** the MotionsComponent is being instantiated
- **WHEN** the component constructor executes
- **THEN** the `effect()` monitoring the error signal **MUST** be initialized without throwing NG0203
- **AND** error messages **MUST** trigger toast notifications correctly

#### Scenario: Error signal triggers toast notification

- **GIVEN** the component is fully initialized
- **WHEN** the `error()` signal emits a non-null value
- **THEN** the effect **MUST** invoke `showToast()` with the error message and 'error' type

---

### Requirement: Hero Image Visibility and Positioning

The motions hero image (`mociones.webp`) **MUST** be visible and positioned prominently in the component's hero section.

**Previously**: Image may have been obscured or incorrectly positioned due to z-index or layout issues.

**Now**: The image **MUST** be clearly visible with proper stacking context, positioned at the top-right of the hero section with appropriate glow effects.

#### Scenario: Hero image loads successfully

- **GIVEN** the `/mociones` route is loaded
- **WHEN** the component renders the hero section
- **THEN** the `mociones.webp` image **MUST** be visible at 128×128px (24×32 container on mobile)
- **AND** the image **MUST** have a z-index of 10 (relative positioning)
- **AND** a deep aura glow effect **MUST** be visible behind the image

#### Scenario: Hero image fails to load

- **GIVEN** the `/mociones` route is loaded
- **WHEN** the `mociones.webp` image fails to load
- **THEN** the `imageError` signal **MUST** be set to `true`
- **AND** a fallback SVG icon **MUST** be displayed with the same styling

---

### Requirement: Mission Tab Navigation

The mission tab navigation bar **MUST** display all available tabs with proper icons and allow users to switch between different mission categories.

**Previously**: Tabs may not have been rendering correctly due to layout issues or missing icon mapping.

**Now**: All tabs **MUST** render with correct icons, proper spacing, and interactive behavior.

#### Scenario: All mission tabs render on load

- **GIVEN** the `/mociones` route is loaded
- **WHEN** the component initializes
- **THEN** the tab navigation **MUST** display buttons for all keys returned by `getMissionTabKeys()`
- **AND** each tab button **MUST** have a minimum height of 44px (11 tailwind units)
- **AND** each tab **MUST** display its corresponding icon from the `social/icons/` directory

#### Scenario: Tab icons display correctly

- **GIVEN** the mission tabs are rendered
- **WHEN** a user views the tab navigation
- **THEN** the `History` tab **MUST** display `social/icons/complete.png`
- **AND** the `Daily` tab **MUST** display `social/icons/daily.png`
- **AND** other tabs (Whatsapp, Facebook, TikTok, Youtube) **MUST** call `getTabIcon(tab)` for their icons

#### Scenario: User switches active tab

- **GIVEN** the user is viewing the `/mociones` route
- **WHEN** the user clicks on a tab button
- **THEN** `setActiveTab(tab)` **MUST** be invoked with the selected tab key
- **AND** the active tab **MUST** have full opacity (opacity-100)
- **AND** inactive tabs **MUST** have reduced opacity (opacity-30)
- **AND** the active tab icon **MUST** scale to 110%
- **AND** the glass sliding indicator **MUST** translate to the active tab position

#### Scenario: Active tab displays corresponding content

- **GIVEN** a tab has been activated
- **WHEN** the component renders the main content area
- **THEN** the `@switch` block **MUST** display content matching the `activeTab()` signal value
- **AND** the `Daily` tab **MUST** show the daily rewards grid
- **AND** the `Whatsapp` tab **MUST** show the Whatsapp missions list
- **AND** the `History` tab **MUST** show the statistics panel
- **AND** other tabs **MUST** show the "En proceso..." placeholder

---

## Coverage Summary

| Requirement | Happy Path | Edge Case | Error State |
|-------------|------------|-----------|-------------|
| Effect Injection Context | ✅ Constructor init | ✅ Error signal emission | ✅ NG0203 prevention |
| Hero Image | ✅ Successful load | ✅ Load failure fallback | ✅ Fallback SVG display |
| Tab Navigation | ✅ All tabs render | ✅ Tab switching | ✅ Icon mapping |

---

## Implementation Notes

- The `effect()` fix is a **one-line move** from `ngOnInit()` to the constructor
- Image positioning uses existing TailwindCSS utilities; no new CSS required
- Tab rendering depends on `missionTabKeys` array and `getTabIcon()` service method
- All changes are **CSS/layout adjustments** or **constructor refactoring** — no new dependencies
