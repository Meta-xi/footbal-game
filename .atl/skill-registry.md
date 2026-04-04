# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When structuring Angular projects or deciding where to place components | angular-architecture | /home/winter/.agents/skills/angular-architecture/SKILL.md |
| When creating Angular components, using signals, or setting up zoneless | angular-core | /home/winter/.agents/skills/angular-core/SKILL.md |
| When working with forms, validation, or form state in Angular | angular-forms | /home/winter/.agents/skills/angular-forms/SKILL.md |
| When optimizing Angular app performance, images, or lazy loading | angular-performance | /home/winter/.agents/skills/angular-performance/SKILL.md |
| Automate browser interactions, test web pages and work with Playwright tests | playwright-cli | /home/winter/.agents/skills/playwright-cli/SKILL.md |
| When user asks to find/install agent skills | find-skills | /home/winter/.agents/skills/find-skills/SKILL.md |
| When building web components, pages, artifacts, posters, or applications | frontend-design | /home/winter/.agents/skills/frontend-design/SKILL.md |
| When encountering any bug, test failure, or unexpected behavior, before proposing fixes | systematic-debugging | /home/winter/.agents/skills/systematic-debugging/SKILL.md |
| Before any creative work — creating features, building components, adding functionality | brainstorming | /home/winter/.agents/skills/brainstorming/SKILL.md |
| When designing, reviewing, or improving UI/UX for web and mobile | ui-ux-pro-max | /home/winter/.agents/skills/ui-ux-pro-max/SKILL.md |
| When user says "judgment day", "review adversarial", "dual review", "juzgar" | judgment-day | /home/winter/.config/opencode/skills/judgment-day/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /home/winter/.config/opencode/skills/issue-creation/SKILL.md |
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | /home/winter/.config/opencode/skills/branch-pr/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | /home/winter/.config/opencode/skills/skill-creator/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | /home/winter/.config/opencode/skills/go-testing/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### angular-architecture
- **Scope Rule**: Components used by 1 feature → `features/[feature]/components/`; used by 2+ features → `features/shared/components/`
- **No suffixes**: `user-profile.ts` NOT `user-profile.component.ts`; `user.ts` NOT `user.service.ts` — folder tells you what it is
- Use `inject()` over constructor injection
- Use `class` and `style` bindings over `ngClass`/`ngStyle`
- `protected` for template-only members, `readonly` for inputs/outputs/queries
- Name handlers for action (`saveUser`) not event (`handleClick`)
- One concept per file, keep lifecycle hooks simple — delegate to well-named methods

### angular-core
- Components are standalone by default — do NOT set `standalone: true`
- Always use `input()`, `output()`, `model()` functions — NEVER `@Input()`/`@Output()` decorators
- Use `signal()` for state, `computed()` for derived state, `effect()` for side effects
- NEVER use lifecycle hooks (`ngOnInit`, `ngOnChanges`, `ngOnDestroy`) — use signals + effect instead
- Always use `inject()` for DI — NEVER constructor injection
- Use native control flow: `@if`, `@for`, `@switch` — NOT `*ngIf`, `*ngFor`
- Signals are default; use RxJS ONLY for complex async (debounce, websockets, race conditions)
- Angular is zoneless — use `provideZonelessChangeDetection()` and `OnPush`

### angular-forms
- For new apps with signals: use Signal Forms (`form()` from `@angular/forms/signals`)
- For production apps: use Reactive Forms with `fb.nonNullable.group()` for type safety
- Use `getRawValue()` to get typed values from Reactive Forms
- Reactive Forms are synchronous (easier to test)
- Simple forms can use template-driven approach

### angular-performance
- ALWAYS use `NgOptimizedImage` for images — set `width` and `height` (or `fill`), add `priority` to LCP image
- Use `@defer` for lazy loading components below the fold (`on viewport`, `on interaction`, `on idle`)
- Lazy load routes with `loadComponent` or `loadChildren`
- Use pure pipes for caching single results, `computed()` for derived signal state
- NEVER trigger reflows/repaints in lifecycle hooks
- SSR for SEO-critical pages, CSR for dashboards/admin, SSG for static marketing

### brainstorming
- MUST explore project context, ask clarifying questions (one at a time), propose 2-3 approaches before implementation
- MUST present design and get user approval BEFORE writing any code — no exceptions
- "Simple" projects still need design (can be short, but must be presented and approved)
- Prefer multiple choice questions, focus on purpose/constraints/success criteria
- Break large projects into independent sub-projects with clear interfaces
- Write design to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit

### find-skills
- When user asks "how do I do X" or "find a skill for X", use `npx skills find [query]`
- Check skills.sh leaderboard first for well-known skills
- Verify quality: prefer 1K+ installs, check source reputation and GitHub stars
- Install with `npx skills add <owner/repo@skill> -g -y`
- If no skills found, offer to help directly or suggest `npx skills init`

### frontend-design
- Choose a BOLD aesthetic direction before coding — avoid generic "AI slop" (no Inter/Roboto, no purple gradients on white)
- Use distinctive font pairings — one display font + one refined body font
- Commit to a cohesive aesthetic with CSS variables, dominant colors with sharp accents
- Use CSS-only animations for HTML, Motion library for React; one well-orchestrated staggered reveal > scattered micro-interactions
- Never use the same design twice — vary between light/dark, different fonts, different aesthetics
- Match complexity to vision: maximalist needs elaborate code, minimalist needs precision and restraint

### go-testing
- Use table-driven tests for pure functions with multiple cases
- Test Bubbletea models directly: call `Model.Update()` with `tea.KeyMsg` and assert state
- Use `teatest.NewTestModel()` for full TUI integration flows with `tm.Send()` and `tm.WaitFinished()`
- Use golden file testing for visual output comparison
- Use `t.TempDir()` for file operation tests, mock system info via interfaces
- Organize tests: `model_test.go`, `update_test.go`, `view_test.go` alongside source files

### issue-creation
- Blank issues disabled — MUST use template (Bug Report or Feature Request)
- Every issue gets `status:needs-review` automatically on creation
- Maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues
- Search for duplicates before creating new issues

### judgment-day
- Launch TWO judge sub-agents via `delegate` (async, parallel) — NEVER review code yourself as orchestrator
- Neither judge knows about the other — no cross-contamination
- Synthesize verdict: Confirmed (both agree), Suspect (one only), Contradiction (disagree)
- WARNING classification: "Can a normal user trigger this?" YES → real, NO → theoretical (report as INFO)
- After fixes, re-launch both judges in parallel; after 2 fix iterations, ASK user before continuing
- NEVER declare APPROVED until: Round 1 CLEAN, or Round 2 with 0 confirmed CRITICALs + 0 confirmed real WARNINGs

### playwright-cli
- Use `playwright-cli open`, `goto`, `click`, `type`, `fill`, `snapshot` for browser automation
- Target elements using refs from snapshot (`e15`, `e3`) — prefer over CSS selectors
- Use `playwright-cli snapshot` to get current page state with element refs
- For form testing: `fill` inputs, `click` submit, `snapshot` to verify result
- Close browser with `playwright-cli close` after testing
- Use named sessions: `playwright-cli -s=mysession open` for parallel browser contexts

### skill-creator
- Create skills when patterns repeat, conventions differ from best practices, or complex workflows need guidance
- Structure: `skills/{name}/SKILL.md` (required), `assets/` (templates), `references/` (local docs)
- Frontmatter required: `name`, `description` (with Trigger:), `license: Apache-2.0`, `metadata.author`, `metadata.version`
- DO: start with critical patterns, use tables for decisions, keep examples minimal
- DON'T: duplicate existing docs, add keywords section, include lengthy explanations
- Register skill in AGENTS.md after creation

### systematic-debugging
- Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
- Phase 1: Read errors carefully, reproduce consistently, check recent changes, gather evidence at component boundaries
- Phase 2: Find working examples in codebase, compare differences, understand dependencies
- Phase 3: Form single hypothesis, test minimally (one variable), verify before continuing
- Phase 4: Create failing test, implement single fix, verify — if 3+ fixes fail, question the architecture
- Red flags: "quick fix", "probably X", "skip the test" → STOP, return to Phase 1

### ui-ux-pro-max
- Accessibility CRITICAL: contrast 4.5:1, focus rings, keyboard nav, aria-labels for icon-only buttons
- Touch targets minimum 44×44pt (iOS) / 48×48dp (Android), 8px+ spacing between targets
- Use WebP/AVIF images, lazy load non-critical, declare width/height to prevent CLS
- No emoji as icons — use SVG (Lucide, Heroicons); consistent icon family and stroke width
- Mobile-first design, min 16px body text, no horizontal scroll, use `min-h-dvh` not `100vh`
- Animation: 150-300ms for micro-interactions, use transform/opacity only, respect prefers-reduced-motion
- Forms: visible labels (not placeholder-only), errors below field, loading/success/error states on submit
- Navigation: bottom nav max 5 items with labels, back must be predictable, deep linking for key screens

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | AGENTS.md | Index — references project conventions and guidelines |
| GEMINI.md | .gemini/GEMINI.md | Gemini-specific instructions |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
