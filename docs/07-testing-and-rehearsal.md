# Testing and rehearsal

## Automated

Run `npm run verify` from the repository root. It checks deterministic fixture
output, TypeScript, unit tests, production build, and public-safety patterns.

For Salesforce, run the focused Apex tests documented under `salesforce/`.
For Slack, run Deno test, lint, format, and type checks under
`slack/approval-hosted/`.

## Manual

- 1366×768 presentation viewport
- 1920×1080 desktop viewport
- narrow mobile viewport
- keyboard navigation and visible focus
- reduced-motion preference
- every page from a clean reload
- every scripted prompt with common typos
- staged/live recovery
- wrong reaction, wrong channel, and repeated reaction
- partial approval followed by remaining approval

## Rehearsal receipt

Record the date, commit, org alias, Slack workspace, mode, seed version, test
results, and any manual exception. Never include tokens, URLs containing
sessions, or private identifiers in the receipt.
