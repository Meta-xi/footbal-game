## Verification Report

**Change**: fix-motions-ui-20260327

---

VERDICT: PASS_WITH_WARNINGS

Executive summary
- The implementation in src/app/features/motions/motions.component.ts and
  src/app/features/motions/motions.service.ts implements the three core
  requirements from the spec: the effect was moved to the constructor (fixing
  NG0203), the hero image is present with error fallback handling, and the
  mission tab bar renders with icons, interaction, and a guarded sliding
  indicator. However there are a couple of minor deviations from the spec and
  a potential stacking/z-index risk that should be addressed before archive.

---

Findings (detailed)

1) NG0203 error fix — effect placement
- Status: PASS
- Evidence:
  - motions.component.ts: effect() is created inside the constructor
    (src/app/features/motions/motions.component.ts lines 333-340). The
    constructor contains:
    "effect(() => { const errorMsg = this.error(); if (errorMsg) {
    this.motionsService.showToast(errorMsg, 'error'); } });"
  - ngOnInit no longer contains effect; it only calls fetchMissions()
    (lines 342-344).
- Spec scenarios covered:
  - "Effect runs without NG0203 error" — satisfied by placing effect in
    constructor (constructor evidence above).
  - "Error signal triggers toast notification" — the effect observes
    this.error() and calls motionsService.showToast(...) when non-null.

2) Image Visibility / Positioning
- Status: PASS_WITH_WARNING
- Evidence:
  - The image wrapper uses the classes `absolute top-0 right-0 mt-4 mr-4 z-10`
    (template, src/app/features/motions/motions.component.ts line 24) which
    places the image in the top-right and applies z-10 as required.
  - The aura/glow element is placed behind the image with `absolute inset-0
    z-0 ...` (line 26) which satisfies the deep aura requirement.
  - The <img> element uses (error) and (load) handlers to update the local
    imageError signal, and an SVG fallback is rendered inside the @else
    branch (image handlers at lines 28-31; SVG fallback lines 33-36; local
    signal declaration at line 316).
- Warnings / Deviations:
  - Spec: the spec text (openspec/specs/motions/spec.md line 34) requires the
    image to be "positioned at the top-center of the hero section". The
    design (design.md) explicitly chose top-right (lines 31-35) and the
    implementation uses top-right (component line 24). This is a spec vs
    design mismatch — the implemented position follows the design but
    deviates from the spec text. Flagging as a WARNING (visual alignment
    decision; not a runtime bug).
  - Potential stacking context / z-index risk: the outer content wrapper has
    `relative z-10` (line 20). The image wrapper also has z-10 (line 24). As
    implemented, some sibling elements (nav, main) are inside the same
    stacking context and could paint above the image depending on DOM order.
    The design recommended other UI elements keep z < 10 so the image is
    never obscured (design.md lines 33-35). Recommendation: explicitly set
    tab/nav/main content to a lower z (z-0 or z-5) or move image z higher to
    avoid accidental overlap. This is a warning (visual), not a functional
    failure, but should be QA'd on target breakpoints.

3) Tab Display, Icons and Sliding Indicator
- Status: PASS
- Evidence:
  - missionTabKeys are provided by the service (src/app/features/motions/motions.service.ts line 35) and consumed in the component
    template with a @for loop (component template lines 55-65). The template
    displays one button per key returned by getMissionTabKeys() (component
    constructor line 319 assigns missionTabKeys = motionsService.getMissionTabKeys()).
  - Buttons include mobile-friendly height `h-11` and `min-w-[56px]` to
    preserve touch targets (template line 57).
  - Icon selection logic:
    - History tab uses `social/icons/complete.png` (template line 58)
    - Daily tab uses `social/icons/daily.png` (template line 58)
    - Other tabs call getTabIcon(tab) which returns icon filenames from the
      service (motions.service.ts lines 191-200). The template concatenates
      the path `social/icons/` with the chosen filename (template line 58),
      resulting in valid paths (e.g. `social/icons/Whatsapp_37229.png`).
  - Active/inactive visual state bindings are present:
    - activeTab() equality drives opacity classes and scale (template lines
      61-63)
    - The sliding glass indicator is only rendered when missionTabKeys.length
      > 0 (guard at template line 44) and uses activeIndex() to compute the
      translateX (lines 48-49). This matches the design requirement to hide
      the indicator when no tabs exist.

Spec compliance matrix (scenarios)
- Effect Injection Context
  - Scenario: Effect runs without NG0203 error → ✅ COMPLIANT (constructor
    effect present, lines 333-340)
  - Scenario: Error signal triggers toast notification → ✅ COMPLIANT (effect
    calls showToast on non-null error)

- Hero Image Visibility and Positioning
  - Scenario: Hero image loads successfully → ✅ COMPLIANT (image present,
    128×128 declared width/height at lines 28-31, wrapper classes include z-10)
  - Scenario: Hero image fails to load → ✅ COMPLIANT (image (error) sets
    imageError to true and SVG fallback is rendered, lines 29-36)
  - Note: position is top-right in implementation (design) vs top-center in
    spec text — visual deviation (WARNING)

- Mission Tab Navigation
  - Scenario: All mission tabs render on load → ✅ COMPLIANT (template iterates
    missionTabKeys; service provides keys, lines 35 and template 55-65)
  - Scenario: Tab icons display correctly → ✅ COMPLIANT (History/Daily
    explicit paths, others via getTabIcon; service returns filenames lines
    191-200; template builds the path line 58)
  - Scenario: User switches active tab → ✅ COMPLIANT (click handler calls
    setActiveTab(tab) line 56 which delegates to service.setActiveTab line 155;
    visual classes update via activeTab() bindings lines 61-63; indicator uses
    activeIndex() lines 48-49)
  - Scenario: Active tab displays corresponding content → ✅ COMPLIANT
    (template @switch uses activeTab() to render correct content; Daily,
    Whatsapp, and History branches are present lines 75-95, 126-151, 152-190)

Issues and Recommendations
- CRITICAL: None found. Core runtime behaviors required by spec are present.
- WARNING(s):
  1. Spec vs design mismatch on image position (spec asks top-center; design
     and implementation use top-right). Resolve by either updating the spec
     to reflect the design or re-positioning the image to top-center.
     (Reference: spec.md line 34; design.md lines 31-35; component line 24)
  2. Potential stacking/z-index risk: the outer content wrapper uses
     `relative z-10` (component line 20) while the image wrapper also uses
     `z-10` (line 24). Design recommended nav/content have z < 10 so the
     image remains unobscured (design.md line 35). Suggest lowering nav/main
     z-index or increasing image z-index to make the intended visual order
     explicit. QA on mobile and tablet breakpoints is advised.
  3. Minor naming/casing incongruence in tab keys (service uses 'Tiktok'
     vs spec 'TikTok', and 'Daily' vs 'DailyReward' labels). Not functionally
     breaking but consider consistent casing for UX polish (service line 35).

Next recommended actions
- If approval to archive is desired, address the two WARNING items above: pick
  whether the image should be top-center (update implementation or spec) and
  make z-index explicit to avoid accidental overlap. Then run visual QA.

Artifacts
- This report saved to openspec/changes/fix-motions-ui-20260327/verify-report.md
  (this file).

---
Generated by sdd-verify sub-agent against files:
- src/app/features/motions/motions.component.ts
- src/app/features/motions/motions.service.ts
and specs/design in openspec/changes/fix-motions-ui-20260327
