# Validation evidence

This record distinguishes repeatable checks from configuration that each user
must complete in their own Salesforce and Slack environments.

## Verified on August 24, 2026

### Level 1

- Deterministic fixture check: 100 fictional accounts and 21 eligible drafts.
- TypeScript type check: passed.
- Vitest: 11 tests passed.
- Production Vite build: passed.
- Public-safety scanner: passed.
- Desktop and narrow responsive layouts: visually inspected.
- Dependency audit at moderate severity: no known vulnerabilities.

### Level 2

- Metadata dry-run: compiled against an authenticated Salesforce demo org
  without mutating it.
- Disposable scratch-org deployment: passed.
- Permission-set assignment: passed.
- Apex: 5 test methods passed, 0 failed, with 79% aggregate run coverage.
- Fixture seed: created exactly 100 accounts and 21 outreach drafts.
- Salesforce Code Analyzer: no critical, high, or moderate findings. Remaining
  findings were low-severity documentation, test-context, and Queueable
  finalizer recommendations.

### Level 3

- Deno format and lint: passed.
- Hosted bridge unit test: passed.
- Event filter, strict payload mapping, and acknowledgement behavior are covered
  by the unit test.

## Intentionally not claimed

- The React workflow does not perform live Data Cloud segmentation.
- Outlook, Calendar, and SharePoint toggles are simulated in Level 1.
- The repository has not been installed into the reader's Slack organization.
- Salesforce external OAuth still requires the reader's Connected App or
  External Client App and Slack encrypted-secret configuration.
- Agentforce is optional and is not deployed by this repository.
- No live email is sent by the default `DRY_RUN` path.

Use these boundaries in every demonstration. A connected demo is strongest when
the audience can tell which parts are live, staged, and intentionally protected.
