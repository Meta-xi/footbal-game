## Exploration: "History" Tab and Pop-up on /mociones

### Current State

The "History" tab within `src/app/features/motions/motions.component.ts` is already present as part of a mission tab switcher. Its content includes:
- **A statistics grid** with placeholders for:
  - "Completadas" (Completed): displays the length of `completedMissions()` signal array.
  - "Fallidas" (Failed): displays the length of `failedMissions()` signal array.
  - "Totales" (Total): displays the length of `missions()` signal array.
  - "Dinero Perdido" (Money Lost): placeholder, currently rendering "0"; not implemented yet.
- **A button** labelled "Ver historial completo" which triggers `openHistoryModal()`

Modal infrastructure is in place, using the `GlassModalComponent` (from `../../shared/ui`). There is logic and CSS for modals and `showHistoryModal` signal, but **there is no implementation for the full history pop-up content** yet.

Signals in the component and service connect tab state, mission arrays, their filtered subgroups, and basic modal open/close handlers. Stats boxes for all numerics but "dinero perdido" are powered by existing data.

### Affected Areas
- `src/app/features/motions/motions.component.ts` — Renders the "History" tab and the stats box; wires button to modal open. Would need to render the modal with a history list table or cards, and populate "dinero perdido".
- `src/app/features/motions/motions.service.ts` — Holds and computes signals for missions, completed/failed, modal state, and methods to open/close modal. Lacks logic for computing "dinero perdido", but the structure allows it.
- `src/app/shared/ui/glass-modal/glass-modal.component.ts` — Modal UI (already designed for flexible content; can be reused for the history pop-up).

### Approaches
1. **Minimal Completion** — Render history list in modal; hardcode or simulate "dinero perdido".
   - Pros: Fast; fits current structure; low risk.
   - Cons: Money lost metric may be inaccurate or misleading; requires manual update later.
   - Effort: Low

2. **Full Calculation** — Implement computation for "Dinero Perdido"; render completed/failed missions, reward/loss values, and all relevant status in the modal.
   - Pros: Accurate stats, fully integrated; future-proof; high UI consistency.
   - Cons: Requires defining business logic for "money lost" per mission; possibly backend/API changes if money lost isn't tracked now.
   - Effort: Medium

3. **API Extension** — Extend backend or fetch logic to directly return "money lost" and detailed mission history, reducing frontend calculation complexity.
   - Pros: Single source of truth; less manual calculation on client.
   - Cons: Requires backend/API changes; higher coordination cost; not viable if backend is fixed.
   - Effort: High

### Recommendation
Recommend **Approach 2**: Compute "Dinero Perdido" in the service by aggregating failed missions' `reward` values, and render a detailed history list (both completed and failed) in the modal using the already available `missions`, `completedMissions`, and `failedMissions` arrays. 

This leverages existing frontend signals, doesn't depend on backend changes, fits within current app patterns, and gives an accurate, user-trust-building UI update.

### Risks
- "Dinero perdido" calculation logic needs clarification (does it always equal the sum of rewards for failed missions? Should it be net outcome?).
- If backend mission objects change, frontend logic may break or get out of sync.
- If there are many missions, modal could become unwieldy; may require pagination or virtual scrolling for large lists.

### Ready for Proposal
Yes — all supporting signals and UI structure are present. Implementation will mainly require building the content for the modal and correctly computing/displaying the new stat.
