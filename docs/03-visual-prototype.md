# Level 1 — visual prototype

## Build order

1. Read `src/data/fixtures.ts` and the deterministic generator.
2. Review the shared view-model types in `src/data/types.ts`.
3. Start the app and inspect every navigation tab.
4. Run the outage workflow from Seller Home.
5. Toggle Beacon's simulated tools and compare responses.
6. Run `npm run verify`.

## Adapt safely

Create a new fictional dataset rather than renaming these records. Preserve the
relationships: the business account's installed hardware must agree with its
service incidents and offer; the household profile must agree with its orders,
plan, and engagement; the outage segment counts must agree with the workflow.

## Deterministic agent

Beacon's staged router is intentionally boring infrastructure: a small set of
tested intents, clear fallbacks, and tool-sensitive response composition. It is
designed for a repeatable presentation, not to impersonate a live language
model.

When you add an intent, add:

- a positive routing test;
- a typo or paraphrase test;
- a collision test against adjacent intents;
- expected behavior for every relevant tool state.
