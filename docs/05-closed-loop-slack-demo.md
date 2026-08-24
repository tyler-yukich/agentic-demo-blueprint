# Level 3 — closed-loop Slack approval

## State machine

```text
Drafting → Awaiting Review → Processing → Completed
                              └──────────→ Retryable Error
```

The Salesforce run is authoritative for batch state. Each child draft records
its display recipient, editable content, approval state, Slack correlation,
delivery state, and activity result.

## Human controls

- Editing a draft does not send it.
- Setting a row to Approved authorizes only that row.
- Reacting with a white check mark authorizes the batch evaluation.
- The event must match the configured channel and server-recorded message.
- The approver's Slack user ID is retained for audit.

## Instant event path

Use Slack's hosted event trigger rather than a polling job or laptop process.
The hosted function obtains Salesforce OAuth from Slack's encrypted store and
forwards the minimal event contract to Apex REST.

## Proof-mode delivery

The safe default is `DRY_RUN`: it sends no email and records completion only.
Optional `TEST_INBOX` mode routes every proof message to one administrator-set
test inbox while keeping the fictional intended recipient in the subject for
verification. Fictional addresses are never passed to the email provider.

## Acceptance rehearsal

1. Create one new run.
2. Confirm Salesforce and Slack review notifications.
3. Edit one subject and body.
4. Approve a subset and react.
5. Confirm the immediate processing acknowledgment.
6. Confirm only approved rows complete.
7. Approve the remainder, remove/re-add the reaction, and confirm completion.
8. Leave the reaction present and prove there are no duplicates.
