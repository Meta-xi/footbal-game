# Proposal: Add Dynamic "Dinero Perdido" Calculation and Full Mission History Modal

## Intent

This proposal aims to enhance the "History" tab on the `/mociones` route by addressing two key missing functionalities:

1. Implementing a dynamic "Dinero Perdido" calculation to show the total money lost from failed missions.
2. Adding a full mission history modal to provide detailed mission records, including both completed and failed missions.

These additions improve the user experience by offering accurate, real-time insights into mission outcomes and enabling comprehensive mission review.

## Scope

### In Scope
- Computing the "Dinero Perdido" value dynamically in the `MotionsService` by aggregating rewards of failed missions.
- Rendering a detailed mission history modal using the existing `GlassModalComponent` with content sourced from `missions`, `completedMissions`, and `failedMissions` signals.
- Styling and structuring the modal content as a scrollable list (or table) with mission-specific details (e.g., status, reward/loss values).

### Out of Scope
- Any changes to backend or API logic to fetch "money lost" calculations.
- Pagination or virtual scrolling for extremely long mission lists (note: potential future optimization).
- Enhancements to "History" tab stats beyond addressing "Dinero Perdido".

## Approach

Building on the exploration findings, we propose the following technical approach:

1. **"Dinero Perdido" Logic**: Extend the `MotionsService` to compute the total rewards from failed missions using its `failedMissions()` signal. The calculation will aggregate the `reward` values of failed missions.
2. **Mission History Modal**: Use the existing `GlassModalComponent` to render a flexible, scrollable modal. Populate the content with a structured list of completed and failed missions using data from `missions`, `completedMissions`, and `failedMissions` signals. Format the list to emphasize mission status and reward/loss details.
3. **UI Integration**: Update the "History" tab to:
   - Dynamically render the computed "Dinero Perdido" value.
   - Wire the "Ver historial completo" button to open the new modal with the full mission history.

By leveraging existing signals and UI infrastructure, this approach provides accurate, user-trust-building updates with minimal disruption or technical debt.

## Affected Areas

| Area                                      | Impact    | Description                                       |
|-------------------------------------------|-----------|---------------------------------------------------|
| `src/app/features/motions/motions.component.ts` | Modified | Render dynamic "Dinero Perdido"; call modal.    |
| `src/app/features/motions/motions.service.ts`   | Modified | Add logic to compute "Dinero Perdido".          |
| `src/app/shared/ui/glass-modal/glass-modal.component.ts` | Reused    | Populate modal with mission history content.      |

## Risks

| Risk                                          | Likelihood | Mitigation                                   |
|-----------------------------------------------|------------|---------------------------------------------|
| Calculation logic clarification for "Dinero Perdido" | Medium     | Confirm with stakeholders. Use signals for flexibility. |
| Large mission lists could affect performance. | High       | Consider future pagination or virtual scrolling. |
| Backend mission model changes could break logic. | Low        | Focus on frontend calculations independent of backend. |

## Rollback Plan

- To revert, restore the "dinero perdido" placeholder to "0" and remove the modal content logic, ensuring the modal remains empty but operable.
- Use version control to roll back `MotionsService` logic to its current state.

## Dependencies

- Existing mission signals (`missions`, `completedMissions`, `failedMissions`).
- `GlassModalComponent` UI framework for modals.

## Success Criteria

- [ ] "Dinero Perdido" dynamically updates based on failed missions.
- [ ] Mission history modal opens, displaying a comprehensive list of completed and failed missions.
- [ ] Modal content is styled appropriately and supports scrolling for large data sets.
- [ ] No regressions occur in existing mission-related statistics or modal behavior.
