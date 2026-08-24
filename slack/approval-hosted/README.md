# Level 3: instant Slack approval bridge

This Slack-hosted reference listens for a ✅ reaction and forwards a compact, authenticated event to Salesforce immediately. Slack runs the workflow; no laptop listener or polling schedule is required.

## Configure

1. Install the [Slack CLI](https://api.slack.com/automation/cli/install).
2. Create a Salesforce External Client App or Connected App with `api`, `id`, and `refresh_token` scopes. Use the Slack external-auth callback URL shown by the CLI.
3. Replace every `REPLACE_...` value in `config.ts` with the demo-org hostname, Salesforce consumer key, and one Slack channel ID. Never commit the resulting file; use `config.local.ts` in a private fork or restore placeholders before publishing.
4. Run `slack auth login`, `slack doctor`, and `slack run` for a development deployment.
5. Complete external authentication when prompted, then create the event trigger with `slack trigger create --trigger-def triggers/reaction_added.ts`.
6. Write the returned channel ID and message timestamp onto the corresponding `Resilience_Outreach_Run__c` record.
7. Test in `DRY_RUN` first. Confirm that only the intended run changes from Awaiting Approval to Complete.

## Security boundary

- Slack stores the Salesforce OAuth credential in its encrypted external-auth store.
- The function obtains the credential only at runtime and never logs it.
- Salesforce authenticates the bearer token, matches the exact channel and message timestamp, and makes reactions idempotent.
- The public package contains no client secret, token, org ID, workspace ID, or real hostname.

See [the Level 3 guide](../../docs/05-closed-loop-slack-demo.md) before deploying.
