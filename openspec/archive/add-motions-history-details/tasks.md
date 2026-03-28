 # Tasks: Add Motions History Details

## Phase 1: Foundation (types & service signals)

- [ ] 1.1 Create/extend model `src/app/models/motion.ts` with interfaces for Motion, MissionHistoryItem (minutes: 20)
- [x] 1.2 Update `src/app/services/motions.service.ts`: add `totalLost$` computed signal that sums lost amounts across motions (minutes: 40)
- [x] 1.3 Update `src/app/services/motions.service.ts`: add `missionHistory$` computed signal that maps motions → mission display items (timestamp, title, moneyLost, outcome, metadata) (minutes: 45)
- [x] 1.4 Ensure `showHistoryModal` signal/state is added to MotionsService with methods `openHistoryModal()` and `closeHistoryModal()` and an observable/signal for components to consume (minutes: 20)

## Phase 2: Core Implementation (service logic & formatting)

- [ ] 2.1 Implement currency formatting/composer used by `totalLost$` (service-level helper or pipe usage; reference existing currency pipe) (minutes: 25)
- [ ] 2.2 Ensure `missionHistory$` items include accessible labels and pre-computed fields (e.g., formattedDate, formattedMoneyLost, statusClass) for simple consumption by template (minutes: 30)

## Phase 3: UI Wiring (component + template)

- [x] 3.1 Update `src/app/pages/motions/motions.component.ts`: inject MotionsService, consume `totalLost$` and `showHistoryModal` signals via `toSignal`/`computed` and expose them to template (minutes: 30)
- [x] 3.2 Update `src/app/pages/motions/motions.component.html`: display `totalLost$` in the stats grid where 'dinero perdido' appears, using existing money formatting (minutes: 20)
- [x] 3.3 Modify the "ver historial completo" button in `motions.component.html` to call `motionsService.openHistoryModal()` and include aria-controls/aria-expanded states (minutes: 15)

## Phase 4: Modal Content (app-glass-modal usage)

- [x] 4.1 Implement modal container in `motions.component.html` using `app-glass-modal` bound to `showHistoryModal`; add role="dialog", aria-modal="true", aria-labelledby pointing to modal title (minutes: 20)
- [x] 4.2 Inside modal, render `missionHistory$` with an `@for` / `*ngFor` loop over items; each item shows date, title, formatted money lost, and status badge; apply design classes (`lg-card-module`, `lg-accent-ring`, `text-slate-900`) (minutes: 45)
- [x] 4.3 Add empty state view when `missionHistory$` is empty: illustration placeholder, short copy, primary action to close modal; ensure focus lands on close button (minutes: 20)
- [x] 4.4 Accessibility: add keyboard support (Escape closes modal), focus trap, descriptive aria-labels on each mission item, and add `tabindex="0"` to mission cards for keyboard reading (minutes: 30)

## Phase 5: Integration & Polishing

- [ ] 5.1 Add `trackBy` function for mission list rendering in `motions.component.ts` (id/timestamp) (minutes: 10)
- [ ] 5.2 Verify `changeDetection: ChangeDetectionStrategy.OnPush` and ensure signals are used correctly to avoid unnecessary change detection (minutes: 15)
- [ ] 5.3 Update or add small CSS/Tailwind classes in template; use existing Liquid Glass utility classes per design (minutes: 15)

## Phase 6: Docs & Handover

- [ ] 6.1 Update `openspec/changes/add-motions-history-details/` with this `tasks.md` (done) and add short dev notes in `notes.md` describing the service signals and public API (minutes: 15)
- [ ] 6.2 Run a manual verification checklist (visual check for empty state, correct total, modal open/close, keyboard navigation) and capture any findings as engram observations (minutes: 20)

### Total estimated effort: ~420 minutes (~7h)
