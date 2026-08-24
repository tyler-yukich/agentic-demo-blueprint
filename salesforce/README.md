# Level 2: connected Salesforce reference

This source-format package turns the Level 1 story into a small connected Salesforce demo. It adds two demo objects, a read-only dashboard service, a lightweight LWC, and an authenticated REST boundary for Level 3.

## Before deployment

1. Authenticate a disposable SDO, Developer Edition, scratch org, or sandbox with `sf org login web --alias readycurrent-demo`.
2. Review every metadata file and the proof-mode defaults.
3. Run `sf project deploy start --target-org readycurrent-demo --source-dir force-app`.
4. Run `sf apex run --target-org readycurrent-demo --file scripts/seed.apex`.
5. Assign `ReadyCurrent_Demo_User` only to demo users.
6. Add `readyCurrentConnectedDemo` to a Lightning page.

The package does not configure Data 360. The fixture-driven risk and eligibility logic remains explicit simulation until you replace `ReadyCurrentDemoService` with org-specific queries.

## Delivery safety

`Resilience_Outreach_Run__c.Delivery_Mode__c` defaults to `DRY_RUN`. The approval service only updates draft status in that mode. The optional `TEST_INBOX` mode requires one explicit `.example`-unsafe real test inbox configured by an admin and is intentionally not seeded here.
