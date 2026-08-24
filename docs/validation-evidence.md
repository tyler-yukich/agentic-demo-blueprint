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
- Deployment into an existing populated Salesforce demo org: passed without
  replacing or modifying its existing app.
- Permission-set assignment: passed.
- Apex after deployment and seeding: 5 test methods passed, 0 failed.
- Fixture seed: created exactly 100 scoped Accounts, 100 scoped Contacts, 36
  elevated-risk Accounts, 21 eligible Accounts, and 21 outreach drafts.
- Idempotency: a second seed run completed successfully and left all five
  counts unchanged.
- Approval state: the dedicated run was verified as `Awaiting Approval`,
  `DRY_RUN`, and not consumed.
- Salesforce Code Analyzer: the available ESLint and regex engines reported no
  critical, high, or moderate authored-source findings. Java-dependent PMD,
  Salesforce Graph Engine, and copy/paste detection were unavailable in the
  validation environment and are disabled in `salesforce/code-analyzer.yml`.

### Level 3

- Deno format and lint: passed.
- Hosted bridge unit test: passed.
- Slack CLI manifest validation: passed. Slack correctly emitted the expected
  reminder to configure external-auth credentials at deployment time.
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
- The embedded Lightning app still requires a visual smoke check in each target
  org because Lightning Web Security, themes, and browser policies vary.

Use these boundaries in every demonstration. A connected demo is strongest when
the audience can tell which parts are live, staged, and intentionally protected.
