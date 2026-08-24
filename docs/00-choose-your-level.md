# Choose your level

## Level 1 — visual prototype

Choose this when you need a strong story quickly or do not control a Salesforce
org. You get the complete React experience, responsive workflow animation,
fictional unified profiles, and deterministic Beacon conversation.

What is simulated: segmentation, eligibility, scores, drafts, application
connectors, and agent reasoning.

What is real: the UI behavior, routing, tool-state logic, deterministic data,
and tests.

## Level 2 — connected Salesforce demo

Choose this when the audience needs to see actual Salesforce records and
writeback. Deploy the sample metadata, seed only fictional records, connect the
experience through the LWC/Apex boundary, and show run and draft state persisting.

Data 360 and Agentforce are optional extensions. Do not claim real segmentation
or live agent behavior unless those extensions are genuinely connected.

## Level 3 — closed-loop agentic demonstration

Choose this when you can administer both Salesforce and Slack and want to prove
human governance. The seller reviews and edits drafts, approves rows, reacts to
authorize the batch, and sees completion in both systems.

This level adds OAuth, event correlation, idempotency, safe delivery, retries,
and operating responsibility. Build Levels 1 and 2 first.

## Recommended progression

For most SEs:

1. Deliver Level 1 once.
2. Connect only the Salesforce record interactions you intend to claim.
3. Add live Agentforce behind a rehearsed deterministic fallback.
4. Add Slack after the Salesforce run/draft state machine is tested.
