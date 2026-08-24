# Level 2: connected Salesforce reference

This source-format package turns the Level 1 story into a small connected
Salesforce demo. It deploys the React experience as an isolated Lightning app,
adds two demo objects, scopes all Account and Contact data with ReadyCurrent
external keys, and provides an authenticated REST boundary for Level 3.

## Before deployment

1. Authenticate a disposable SDO, Developer Edition, scratch org, or sandbox:

   ```bash
   sf org login web --alias readycurrent-demo
   ```

2. Confirm that the generated bundle and seed resource are current:

   ```bash
   npm run verify
   ```

3. Preview the metadata deployment without changing the org:

   ```bash
   cd salesforce
   sf project deploy preview --target-org readycurrent-demo --source-dir force-app
   sf project deploy start --dry-run --target-org readycurrent-demo \
     --source-dir force-app --test-level RunSpecifiedTests \
     --tests ReadyCurrentDemoTest --wait 30
   ```

4. Deploy, assign the permission set, and seed the fictional records:

   ```bash
   sf project deploy start --target-org readycurrent-demo \
     --source-dir force-app --test-level RunSpecifiedTests \
     --tests ReadyCurrentDemoTest --wait 30
   sf org assign permset --target-org readycurrent-demo \
     --name ReadyCurrent_Demo_User
   sf apex run --target-org readycurrent-demo --file scripts/seed.apex
   ```

5. Open the dedicated **ReadyCurrent** Lightning app. The app and its custom
   tab are included in the package; no App Builder work is required.

   ```bash
   sf org open --target-org readycurrent-demo \
     --path lightning/app/ReadyCurrent_Embedded
   ```

6. Confirm the dashboard shows 100 accounts, 36 elevated-risk accounts, 21
   eligible accounts, 21 drafts, and `Awaiting Approval`.

The seed is idempotent. Running it again updates the same 100 Accounts and 100
Contacts and recreates only the 21 drafts owned by `readycurrent-seed-v1`.
Existing records remain untouched because every query, upsert, and cleanup is
constrained by ReadyCurrent discriminator keys.

To remove only this sample's data while leaving the metadata installed:

```bash
sf apex run --target-org readycurrent-demo --file scripts/cleanup.apex
```

The package does not configure Data 360. The fixture-driven risk and
eligibility logic remains explicit simulation until you replace
`ReadyCurrentDemoService` with org-specific queries.

The package also includes a dedicated, PKCE-enabled External Client
Application for the optional Beacon Slack bridge. Its callback is Slack's
hosted external-auth callback, its consumer secret is optional, and its scopes
are limited to identity, API access, and refresh tokens. Retrieve its generated
consumer key from Salesforce only when installing Level 3; never commit that
value.

## Delivery safety

`Resilience_Outreach_Run__c.Delivery_Mode__c` defaults to `DRY_RUN`. The approval service only updates draft status in that mode. The optional `TEST_INBOX` mode requires one explicit `.example`-unsafe real test inbox configured by an admin and is intentionally not seeded here.
