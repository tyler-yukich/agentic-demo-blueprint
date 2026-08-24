# Extracting a component into its own repository

This monorepo is the canonical learning path. Its three levels are deliberately
separable so an SE can start with only the part they need without copying
customer history or credentials.

## Level 1: visual prototype

Keep these paths:

```text
src/
public/
scripts/
index.html
package.json
package-lock.json
tsconfig*.json
vite.config.ts
vitest.config.ts
```

Copy the root safety, contribution, and license files too. Run
`npm install && npm run verify` before publishing the extracted project.

## Level 2: Salesforce reference

The `salesforce/` directory is already a standalone Salesforce DX project.
Move that directory to a new repository root, then retain this repository's
`SECURITY.md`, `LICENSE`, and the relevant connected-demo documentation.

Validate first against a disposable scratch org. Do not make a customer org
the first deployment target.

## Level 3: Slack approval bridge

The `slack/approval-hosted/` directory is an independent Slack CLI project.
Move it to a new repository root and replace only the explicit placeholders in
`config.ts`. External OAuth secrets belong in Slack's encrypted store, never in
source control.

Run `deno task test` before creating a trigger or installing the app.

## Preserve one canonical source

If separate repositories are published, choose this monorepo as the upstream
source and automate extraction. Avoid editing the same code independently in
four repositories; otherwise security fixes and setup instructions will drift.

A future release workflow can use `git subtree split` for the Salesforce and
Slack directories. The React layer is rooted at the repository top, so publish
it from a small allowlist like the one above rather than copying the whole tree.
