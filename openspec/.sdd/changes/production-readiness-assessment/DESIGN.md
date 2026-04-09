# Design: Production Readiness Assessment

## Technical Approach

This design outlines the "Full Production Playbook," a set of practices and tools to make the application production-ready. The approach focuses on establishing a baseline for Continuous Integration, Observability, and Security, adhering to the principles and technologies already in use within the project. We will introduce a CI/DE pipeline using GitHub Actions, formalize a logging strategy, and enhance security scanning. This will be done while respecting the existing Angular-based architecture.

## Architecture Decisions

### Decision: CI/CD with GitHub Actions

**Choice**: Use GitHub Actions for the CI/CD pipeline.
**Alternatives considered**: Jenkins, CircleCI.
**Rationale**: GitHub Actions is tightly integrated with the source code repository, offers a generous free tier, and has a vast marketplace of reusable actions. This allows for a quick and easy setup, aligning with the goal of establishing a baseline playbook without introducing complex new infrastructure. The existing `package.json` scripts (`test`, `build`) can be directly used.

### Decision: 'Hybrid' Artifact Storage

**Choice**: Store SDD artifacts in a hybrid model: text-based artifacts (proposal, specs, design, tasks) in Git, and build/test outputs on the local filesystem.
**Alternatives considered**: Storing all artifacts in Git, using a dedicated artifact repository like Artifactory.
**Rationale**: The user specified `hybrid` mode. This approach keeps the Git repository lean and fast by excluding large, ephemeral build outputs. Text-based design and specification documents are versioned alongside the code they describe, which is a major benefit. For this project's scale, a local file-based artifact store (`./.sdd/artifacts/`) is sufficient and avoids the overhead of a dedicated server.

### Decision: Structured Console Logging

**Choice**: Implement a structured logging strategy that outputs JSON to the console.
**Alternatives considered**: Using a third-party logging library (e.g., `ngx-logger`), sending logs directly to a service.
**Rationale**: While `NgxSonner` handles user-facing notifications, it doesn't provide insight into the application's internal state. A structured console log is a non-intrusive, dependency-free way to create a machine-readable log stream. This provides immediate value for local development and debugging, and lays the groundwork for future log aggregation into systems like Splunk or Datadog without requiring code changes.

## Data Flow

The proposed CI/CD data flow is as follows:

```
    Developer ──(git push)──> GitHub Repo ──(trigger)──> GitHub Actions
                                                             │
                  ┌──────────────────────────────────────────┘
                  │
                  ▼
    1. Checkout Code ──> 2. Install Deps (`bun install`) ──> 3. Run Tests (`vitest run`)
                                                                          │
                                                                          ▼
                                                    4. Build App (`npm run build`) ──> 5. Archive Artifacts
                                                                                               │
                                                                                               ▼
                                                                                   (future) Deploy to Hosting
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `.github/workflows/ci.yml` | Create | Defines the main CI/CD pipeline for building and testing the application. |
| `src/app/core/services/logger.service.ts` | Create | A new service for structured application logging. |

## Interfaces / Contracts

### LoggerService Interface

```typescript
export interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: Record<string, any>;
}

export abstract class LoggerService {
  abstract debug(message: string, context?: Record<string, any>): void;
  abstract info(message: string, context?: Record<string, any>): void;
  abstract warn(message: string, context?: Record<string, any>): void;
  abstract error(message: string, context?: Record<string, any>): void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `LoggerService` | Verify that the service correctly formats and outputs log messages at different levels. |
| Integration | GitHub Actions Workflow | The `ci.yml` workflow will be tested by pushing a commit and verifying its successful execution in the GitHub Actions tab. |
| E2E | N/A | No end-to-end tests are part of this change, but the CI pipeline is where they would be added. |

## Migration / Rollout

No migration is required for this change. The CI/CD pipeline will be triggered on subsequent pushes to the main branch. The logging service will be available for new features to adopt.

## Open Questions

- [ ] Are there any specific secrets (e.g., for future deployment steps) that need to be managed in the GitHub Actions environment?
