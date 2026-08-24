# Level 2 — connected Salesforce demo

The connected path keeps the React view model stable and replaces selected
fixture values at one service boundary.

## Golden Path

1. Authenticate a disposable or dedicated demo org with a descriptive alias.
2. Run the preflight in `salesforce/README.md`.
3. Deploy the scoped manifest.
4. Assign the permission set.
5. Run the idempotent fictional seed script.
6. Execute focused Apex tests.
7. Open the sample Lightning tab.
8. Verify that outreach run and draft status changes persist in Salesforce.

The included deployment creates a separate **ReadyCurrent** Lightning app. It
does not replace an org's existing navigation, branding, home pages, Accounts,
Contacts, or demo applications. The React bundle runs in an isolated HTML frame
inside the scoped `ReadyCurrentEmbedded` static resource. The Lightning wrapper
sends only the aggregate view model returned by `ReadyCurrentDemoService` over
a correlated `postMessage` boundary. This avoids relying on cross-sandbox
global variables under Lightning Web Security.

The embedded Vite build explicitly replaces React's Node-only production flag.
`npm run embedded:check` fails if an unresolved `process.env` reference returns
or if the generated frame no longer contains the expected mount and asset
references. This check is part of `npm run verify`.

The fictional dataset can safely coexist with other demo personas:

- Account keys use `RC-ACC-###`;
- Contact keys use `RC-CON-###`;
- the outreach run uses `readycurrent-seed-v1`;
- service and approval queries reject records outside those namespaces; and
- `scripts/cleanup.apex` deletes only records carrying those keys.

## What to connect first

- seller identity;
- open opportunities;
- outreach run and draft state;
- selected Account and Contact fields;
- installed Assets or Orders;
- service Cases;
- record URLs.

Keep narrative scores and external engagement signals staged until their real
source is connected. A partially connected demo is credible when its boundary
is explicit.

## Optional Agentforce

Connect Beacon only after the record path works. Use the Agent API through a
proper External Client App and keep the deterministic mode available. Normalize
live replies into the renderer's supported structures before displaying them.
