# Tasks: Production Readiness Assessment

## Phase 1: Foundation / Infrastructure

- [x] 1.1 Create `src/environments/environment.prod.ts` — add production flags, SENTRY_DSN, ANALYTICS_KEY
- [x] 1.2 Add CI workflow `/.github/workflows/ci.yml` — run bun install, build, lint, vitest run
- [x] 1.3 Add `Dockerfile` at project root — production build + lightweight server (nginx)
- [x] 1.4 Add `docs/production.md` — instructions for build, deploy, env variables, health checks

## Phase 2: Core Implementation

- [x] 2.1 Implement `src/app/services/logging.service.ts` — wrapper for console/Sentry with levels
- [ ] 2.2 Add `src/app/interceptors/error-interceptor.ts` — capture errors and forward to LoggingService
- [ ] 2.3 Add `src/app/interceptors/token-interceptor.ts` — attach auth header and handle 401 retry
- [ ] 2.4 Initialize Sentry in `src/main.ts` (guarded by env.production flag)
- [ ] 2.5 Ensure lazy loading in `src/app/app-routing.ts` — convert heavy feature routes to loadChildren

## Phase 3: Integration / Wiring

- [ ] 3.1 Register interceptors/providers in `src/app/app.module.ts` or `src/main.ts` bootstrap providers
- [ ] 3.2 Wire LoggingService into top-level error handler `src/app/app.errors.ts` or global handler
- [ ] 3.3 Add `src/assets/nginx.conf` for Docker image and reference it from `Dockerfile`

## Phase 4: Testing / Verification

- [ ] 4.1 Test: vitest unit `src/app/services/logging.service.spec.ts` — verify level routing and Sentry call
- [ ] 4.2 Test: vitest `src/app/interceptors/error-interceptor.spec.ts` — ensure errors are reported and rethrown
- [ ] 4.3 Test: vitest `src/app/interceptors/token-interceptor.spec.ts` — ensure Authorization header and 401 retry
- [ ] 4.4 Add CI validation in `/.github/workflows/ci.yml` to run `vitest run` and build

## Phase 5: Cleanup / Documentation

- [ ] 5.1 Update `README.md` — add production deploy checklist and required env vars
- [ ] 5.2 Update `angular.json` build budgets (if present) — set warning/error budgets for bundle size
- [ ] 5.3 Remove any console.log left in `src/app/` components (search & replace)
