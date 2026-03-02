## Exploration: redesign-energy-boost

### Current State
The `EnergyBoostComponent` is currently positioned inside the `<main>` tag in `game-layout.component.ts`. While `game-layout.component.html` (which seems to be an older version or template reference) positions it absolutely at `bottom-[130px]`, the active implementation in the `.ts` file places it at the end of a flex column:
```typescript
<main class="flex-1 flex flex-col px-4 gap-3 pb-24 overflow-hidden">
  <app-action-buttons />
  <app-balance />
  <app-tap-area class="flex-1 flex flex-col justify-center items-center min-h-0" />
  <app-energy-boost />
</main>
```
The style uses `liquid-glass-card` and `liquid-glass-button` classes, but they don't fully match the modern "Liquid Glass" pill style seen in `BottomNavComponent`. The buttons are currently separate elements rather than being part of a unified pill container.

### Affected Areas
- `src/app/views/game/components/energy-boost/energy-boost.component.ts` — Update template and styles to match the pill-shaped Liquid Glass design.
- `src/app/views/game/game-layout.component.ts` — Move the component position up (likely before `app-tap-area` or adjusting the flex layout).

### Approaches

1. **Unified Pill Layout (Recommended)**
   - Redesign the component to use a single `lg-pill` container (from `styles.scss`) or a custom one matching `BottomNavComponent`.
   - Wrap both the energy display and the boost button in this pill.
   - Use inner capsules for the active/clickable parts to match the "Liquid Glass" reference.
   - Pros: Consistent with the app's modern UI; professional "tempered glass" look.
   - Cons: Requires careful spacing to ensure text remains readable.
   - Effort: Medium

2. **Refined Separate Buttons**
   - Keep the energy bar and boost button separate but update their individual styles to use `lg-bubble` or refined `liquid-glass-card` properties.
   - Pros: Simple change, maintains current UX structure.
   - Cons: Doesn't achieve the unified "pill" look requested by the user.
   - Effort: Low

### Recommendation
Adopt **Approach 1 (Unified Pill Layout)**. The user specifically mentioned the "Liquid Glass" style from navigation buttons (which are in a pill container) and wants a more professional look. Using a unified pill for both energy and boost will create a cleaner, more integrated UI component. To "move it up", I recommend placing it above the `app-tap-area` or giving it more prominence in the layout.

### Risks
- **Layout shift**: Moving the component up might interfere with the tap area's accessibility or visual balance.
- **Contrast**: The "Liquid Glass" style is translucent; we must ensure the energy text and "Boost" label remain highly legible against the background.

### Ready for Proposal
Yes.
