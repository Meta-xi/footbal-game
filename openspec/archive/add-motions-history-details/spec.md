# Delta for Motions History Tab

## Feature Description

This specification defines two enhancements to the `/mociones` route's "History" tab:

1. **Dynamic "Dinero Perdido" Calculation**: Display the total monetary value lost from failed missions, calculated by summing the `reward` values of all missions where `completed` is `false`.

2. **Full Mission History Modal**: A comprehensive modal displaying both completed and failed missions when the user clicks "Ver historial completo".

These features provide accurate, real-time mission tracking and enable users to review their complete mission history.

---

## ADDED Requirements

### Requirement: Dynamic Dinero Perdido Display

The system **MUST** calculate and display the total money lost from failed missions in the History tab statistics grid.

**Calculation**: Sum of `reward` values from all missions where `completed === false` (sourced from `failedMissions()` signal in `MotionsService`).

**Display Format**: `{{ totalLost | number }} COP` with rose accent styling (class `text-rose-400`).

#### Scenario: User views History tab with no failed missions

- **GIVEN** the user has 0 failed missions
- **WHEN** the user navigates to the "History" tab
- **THEN** "Dinero Perdido" displays "0"
- **AND** the value uses rose accent styling

#### Scenario: User views History tab with multiple failed missions

- **GIVEN** the user has 3 failed missions with rewards of 1000, 1500, and 2000 COP
- **WHEN** the user navigates to the "History" tab  
- **THEN** "Dinero Perdido" displays "4,500" (formatted with thousands separator)
- **AND** the currency "COP" is shown

#### Scenario: Failed missions update dynamically

- **GIVEN** the user is viewing the "History" tab with 2 failed missions (total: 3000 COP)
- **WHEN** a new mission fails with a reward of 1000 COP
- **THEN** "Dinero Perdido" updates to "4,000" without requiring page refresh

---

### Requirement: Full Mission History Modal

The system **MUST** display a modal containing the complete mission history when the user clicks "Ver historial completo".

**Modal Content**: A scrollable list of all missions from `missions()` signal, displaying:
- Mission title
- Mission description (truncated if necessary)
- Reward value with currency
- Status indicator (completed or failed)
- Mission icon

**Modal Behavior**:
- Opens on "Ver historial completo" button click
- Uses existing `GlassModalComponent`
- Closes on backdrop click, ESC key, or close button
- Scrollable for lists exceeding viewport height

#### Scenario: User opens mission history modal with mixed missions

- **GIVEN** the user has 5 completed missions and 3 failed missions
- **WHEN** the user clicks "Ver historial completo"
- **THEN** a modal opens displaying all 8 missions
- **AND** each mission shows title, description, reward, and status
- **AND** completed missions have a success status indicator
- **AND** failed missions have a failure status indicator

#### Scenario: User closes mission history modal

- **GIVEN** the mission history modal is open
- **WHEN** the user clicks the modal backdrop
- **THEN** the modal closes
- **AND** the user returns to the History tab view

#### Scenario: Empty mission history

- **GIVEN** the user has 0 missions  
- **WHEN** the user clicks "Ver historial completo"
- **THEN** the modal opens
- **AND** displays a message "No hay misiones en el historial"
- **AND** uses subtle white/opacity styling

#### Scenario: Modal displays scrollable content

- **GIVEN** the user has 20 missions
- **WHEN** the user opens the mission history modal
- **THEN** the modal content is scrollable
- **AND** all 20 missions are accessible via scroll
- **AND** the modal header remains fixed

---

## Technical Requirements

### Data Source
- **Signals Used**: `missions()`, `completedMissions()`, `failedMissions()` from `MotionsService`
- **Calculation Logic**: `failedMissions().reduce((sum, m) => sum + m.reward, 0)`

### Display Requirements

| Element | Requirement |
|---------|-------------|
| Dinero Perdido Value | MUST use `DecimalPipe` with thousands separator |
| Currency Label | MUST display "COP" |
| Modal Title | SHOULD use "Historial Completo de Misiones" |
| Mission List Item | MUST show: icon, title, description, reward, status |
| Status Indicator | MUST differentiate completed (green) vs failed (red/rose) |
| Empty State | MUST show when `missions().length === 0` |

### Styling Requirements

| Component | Classes |
|-----------|---------|
| Dinero Perdido | `text-rose-400`, `tracking-tighter`, `text-glow` |
| Modal Panel | Use `lg-modal-panel` from GlassModalComponent |
| Mission Item | Use `lg-card-card` or `lg-module-card` with hover effects |
| Status Badge | Use `lg-status-badge` with conditional dot colors |
| Scroll Container | `overflow-y-auto`, `no-scrollbar`, `max-h-[60vh]` |

---

## Acceptance Criteria Summary

| Criterion | Status |
|-----------|--------|
| Dinero Perdido calculates sum of failed mission rewards | Required |
| Dinero Perdido updates reactively when missions change | Required |
| Modal opens on button click | Required |
| Modal displays all missions with complete data | Required |
| Modal differentiates completed vs failed missions | Required |
| Modal closes on backdrop/ESC/close button | Required |
| Modal content is scrollable for long lists | Required |
| Empty state handled gracefully | Required |

---

## Coverage

- **Happy paths**: ✅ Covered (view stats, open modal, close modal)
- **Edge cases**: ✅ Covered (empty missions, zero failed missions, large lists)  
- **Error states**: ✅ Covered (empty state message)

---

## Next Step

Ready for design (sdd-design) or tasks (sdd-tasks) once design is complete.
