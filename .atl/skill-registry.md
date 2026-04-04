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
| Before any creative work — creating features, building components, adding functionality | brainstorming | /home/winter/.agents/skills/brainstorming/SKILL.md |
| Go testing, Bubbletea TUI testing, teatest | go-testing | /home/winter/.config/opencode/skills/go-testing/SKILL.md |
| "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar" | judgment-day | /home/winter/.config/opencode/skills/judgment-day/SKILL.md |
| Creating a pull request, opening a PR, preparing changes for review | branch-pr | /home/winter/.config/opencode/skills/branch-pr/SKILL.md |
| Creating a GitHub issue, reporting a bug, requesting a feature | issue-creation | /home/winter/.config/opencode/skills/issue-creation/SKILL.md |
| Creating a new skill, add agent instructions, document patterns for AI | skill-creator | /home/winter/.config/opencode/skills/skill-creator/SKILL.md |
| Discovering and installing agent skills | find-skills | /home/winter/.agents/skills/find-skills/SKILL.md |
| Automate browser interactions, test web pages, Playwright tests | playwright-cli | /home/winter/.agents/skills/playwright-cli/SKILL.md |
| UI/UX design, styles, color palettes, font pairings, accessibility | ui-ux-pro-max | /home/winter/.agents/skills/ui-ux-pro-max/SKILL.md |
| Create web components, pages, artifacts, posters, applications | frontend-design | /home/winter/.agents/skills/frontend-design/SKILL.md |
| Any bug, test failure, unexpected behavior, before proposing fixes | systematic-debugging | /home/winter/.agents/skills/systematic-debugging/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### angular-core
- Standalone components by default — NEVER set `standalone: true` decorator
- Use `input()`, `output()`, `model()` functions — NEVER `@Input()`/`@Output()` decorators
- Use `signal()` for state, `computed()` for derived state, `effect()` for side effects
- NEVER use lifecycle hooks (`ngOnInit`, `ngOnChanges`, `ngOnDestroy`) — use signals + effect
- Use `inject()` instead of constructor injection
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Use native control flow: `@if`, `@for`, `@switch` — NEVER `*ngIf`, `*ngFor`, `*ngSwitch`
- NEVER use `ngClass` or `ngStyle` — use `[class.some-class]` and `[style.property]`
- NEVER write arrow functions in templates (not supported)
- Use `toSignal()` for RxJS → Signals conversion, avoid experimental `resource()` API
- Signals are default; use RxJS ONLY for complex async (debounce, websockets, race conditions)

### angular-architecture
- Scope Rule: 1 feature → `features/[feature]/components/`, 2+ features → `features/shared/`
- Core singletons go in `core/services/`, `core/interceptors/`, `core/guards/`
- NO `.component`, `.service`, `.model` suffixes — folder tells you what it is
- Main component has same name as folder: `features/cart/cart.ts`
- Feature-specific components in `components/` subfolder
- Shared components ONLY when used by 2+ features
- Use `inject()` over constructor injection, `protected` for template-only members
- Name handlers for action (`saveUser`) not event (`handleClick`)
- One concept per file, keep lifecycle hooks simple — delegate to well-named methods

### angular-forms
- New apps with signals → Signal Forms (experimental, `form()` from `@angular/forms/signals`)
- Production apps → Reactive Forms with `FormBuilder`, `Validators`
- Use `getRawValue()` to get typed values from Reactive Forms
- Reactive Forms are synchronous (easier to test)
- Simple forms → Template-driven
- Use `inject(FormBuilder)` instead of constructor injection

### angular-performance
- ALWAYS use `NgOptimizedImage` (`ngSrc`) — NEVER plain `src` for static images
- ALWAYS set `width` and `height` (or `fill`) on `ngSrc` images
- Add `priority` to LCP image only
- Use `@defer (on viewport)` for below-fold content
- Use `@defer (on interaction)` for click/focus/hover triggered content
- Lazy load feature routes with `loadComponent`
- Use `@defer` triggers: `on viewport`, `on interaction`, `on idle`, `on timer`, `when condition`
- Parent of `fill` image must have `position: relative/fixed/absolute`
- Use pure pipes for caching single results, `computed()` for derived signal state
- NEVER trigger reflows/repaints in lifecycle hooks

### brainstorming
- MUST be invoked BEFORE any creative work (features, components, functionality)
- Ask ONE question at a time — never overwhelm with multiple questions
- Prefer multiple choice questions over open-ended
- Propose 2-3 approaches with trade-offs before settling
- Present design sections incrementally, get approval after each
- HARD-GATE: Do NOT write code or implement until design is approved
- "Simple" projects still need design (can be short, but must be presented and approved)
- Write spec to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit
- Run spec review loop (max 3 iterations) before user review
- Invoke `writing-plans` skill after spec approval — NEVER other implementation skills

### go-testing
- Use table-driven tests for multiple test cases: `t.Run(tt.name, ...)`
- Bubbletea TUI: test `Model.Update()` directly for state transitions
- Use `teatest.NewTestModel()` for full TUI integration flows
- Golden file testing for visual output: compare against saved `.golden` files
- Mock system dependencies with interfaces, use `t.TempDir()` for file ops
- Test both success and error cases for functions returning errors
- Use `go test -short` to skip integration tests, `-update` to update golden files
- Organize tests: `model_test.go`, `update_test.go`, `view_test.go` alongside source files

### judgment-day
- Launch TWO judges in parallel via `delegate` (async) — NEVER sequential
- Neither judge knows about the other — no cross-contamination
- Orchestrator synthesizes: Confirmed (both agree), Suspect (one only), Contradiction
- WARNING classification: "Can a normal user trigger this?" → YES = real, NO = theoretical
- Theoretical warnings reported as INFO — do NOT fix, do NOT re-judge
- After fixes: re-launch both judges in parallel for re-judgment
- After 2 fix iterations, ASK user before continuing — never escalate automatically
- NEVER push/commit before re-judgment completes
- NEVER declare APPROVED until: Round 1 CLEAN, or Round 2 with 0 confirmed CRITICALs + 0 confirmed real WARNINGs
- Resolve skills from registry BEFORE launching judges (Pattern 0)

### branch-pr
- Every PR MUST link an approved issue (`status:approved` label)
- Every PR MUST have exactly one `type:*` label
- Branch naming: `type/description` — lowercase, only `a-z0-9._-`
- Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`
- PR body MUST contain: `Closes #N`, type checkbox, summary, changes table, test plan
- Conventional commits: `type(scope): description` — match regex pattern
- Run `shellcheck` on modified scripts before pushing
- NEVER add `Co-Authored-By` or AI attribution to commits

### issue-creation
- Blank issues disabled — MUST use template (Bug Report or Feature Request)
- Every issue gets `status:needs-review` automatically
- Maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, NOT issues
- Search existing issues for duplicates before creating
- Bug Report: include steps to reproduce, expected vs actual behavior, OS/agent/shell
- Feature Request: include problem description, proposed solution, affected area

### skill-creator
- Create skill when: pattern repeats, AI needs guidance, complex workflows need steps
- Don't create when: documentation exists, pattern is trivial, it's a one-off
- Structure: `skills/{name}/SKILL.md` + optional `assets/` (templates) + `references/` (docs)
- Frontmatter: `name`, `description` (with Trigger), `license: Apache-2.0`, `metadata.author`, `metadata.version`
- DO: start with critical patterns, use tables for decisions, keep examples minimal
- DON'T: add Keywords section, duplicate existing docs, include lengthy explanations
- references/ should point to LOCAL files, not web URLs
- Register skill in AGENTS.md after creation

### find-skills
- Use `npx skills find [query]` to search ecosystem
- Check skills.sh leaderboard before running CLI search
- Verify quality: prefer 1K+ installs, official sources (vercel-labs, anthropics, microsoft)
- Present options with: name, description, install count, install command, link
- Install with: `npx skills add <owner/repo@skill> -g -y`
- If no skills found: acknowledge, offer to help directly, suggest `npx skills init`

### playwright-cli
- Core commands: `open`, `goto`, `click`, `type`, `fill`, `snapshot`, `screenshot`, `close`
- Use `snapshot` to get refs (e15, e3, etc.) for interactions — prefer over CSS selectors
- Keyboard: `press Enter`, `press ArrowDown`, `keydown Shift`, `keyup Shift`
- Mouse: `mousemove x y`, `mousedown`, `mouseup`, `mousewheel dx dy`
- Tabs: `tab-list`, `tab-new`, `tab-close`
- Frames: `frame-list`, `frame-focus <id>`
- Wait: `wait-for <selector>`, `wait-for text "..."`, `wait-for url "..."`
- Network: `network-capture`, `network-list`, `network-clear`
- Use named sessions: `playwright-cli -s=mysession open` for parallel browser contexts

### ui-ux-pro-max
- Accessibility CRITICAL: contrast 4.5:1, focus rings, keyboard nav, aria-labels for icon-only buttons
- Touch targets: minimum 44x44pt, 8px+ spacing between targets
- NEVER rely on hover alone for mobile — use click/tap for primary interactions
- Performance: WebP/AVIF, lazy loading, reserve space (CLS < 0.1)
- Style: match product type, consistency, SVG icons (no emoji)
- Mobile-first breakpoints, viewport meta, no horizontal scroll
- Typography: base 16px, line-height 1.5, semantic color tokens
- Animation: duration 150-300ms, motion conveys meaning, respect prefers-reduced-motion
- Forms: visible labels, error near field, helper text, progressive disclosure
- Charts: legends, tooltips, accessible colors, never color-only meaning

### frontend-design
- Choose BOLD aesthetic direction before coding — NOT generic AI aesthetics
- NEVER use: Inter, Roboto, Arial, system fonts, purple gradients on white
- Pick distinctive fonts — pair display font with refined body font
- Commit to cohesive color scheme with CSS variables
- Motion: CSS-only for HTML, Motion library for React, staggered reveals
- Spatial composition: asymmetry, overlap, diagonal flow, generous negative space
- Match complexity to aesthetic vision — maximalist needs elaborate code, minimalist needs restraint
- Production-grade, functional, visually striking, memorable

### systematic-debugging
- NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST — Iron Law
- Phase 1: Read errors carefully, reproduce consistently, check recent changes
- Phase 2: Find working examples in codebase, compare differences, understand dependencies
- Phase 3: Form single hypothesis, test minimally, one variable at a time
- Phase 4: Create failing test case, implement single fix, verify
- If 3+ fixes failed → question architecture, discuss with human partner
- STOP on: "quick fix for now", "just try X", "skip the test", "probably X"
- Add diagnostic instrumentation at component boundaries for multi-component systems

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | /run/media/winter/DATA/Code/footbal-game/AGENTS.md | Index — references project conventions and guidelines |
| .gemini/AGENTS.md | /run/media/winter/DATA/Code/footbal-game/.gemini/AGENTS.md | Gemini-specific agents config |
| .gemini/GEMINI.md | /run/media/winter/DATA/Code/footbal-game/.gemini/GEMINI.md | Gemini CLI instructions |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
