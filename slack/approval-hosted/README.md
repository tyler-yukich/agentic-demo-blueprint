# Level 3: instant Slack approval bridge

This Slack-hosted reference listens for a ✅ reaction and forwards a compact, authenticated event to Salesforce immediately. Slack runs the workflow; no laptop listener or polling schedule is required.

## Configure

1. Install the [Slack CLI](https://api.slack.com/automation/cli/install).
2. Deploy Level 2 first. It includes the dedicated
   `ReadyCurrent_Slack_Hosted_Bridge` External Client Application with Slack's
   callback URL, PKCE, and the required `api`, identity, and refresh-token
   scopes.
3. In Salesforce Setup, open **External Client App Manager → ReadyCurrent Slack
   Hosted Bridge → Settings → OAuth Settings → Consumer Key and Secret**.
   Complete identity verification and copy the generated consumer key. Keep the
   consumer secret out of the project and terminal history.
4. Create a dedicated Slack channel, such as `#readycurrent-approvals`. Some
   Enterprise Grid policies block API-created channels; creating it in Slack's
   normal UI is an acceptable one-time admin step.
5. Replace the three placeholder values in `config.ts` with the demo-org
   hostname, the Salesforce consumer key, and the dedicated Slack channel ID.
   Never commit those environment-specific values; restore the placeholders
   before publishing or use a private deployment branch.
6. Run `deno task test`, `slack manifest validate`, `slack auth login`, and
   `slack doctor`.
7. Use `slack run` for a development deployment or `slack deploy` for a hosted
   deployment. Add the dedicated Salesforce consumer secret with
   `slack external-auth add-secret` when prompted; Slack stores it in the
   encrypted external-auth store. Complete Salesforce external authorization
   afterward. Never place the secret in this repository, a command argument, or
   a captured log.
8. Create the event trigger with
   `slack trigger create --trigger-def triggers/reaction_added.ts`.
9. Write the returned channel ID and the approval message timestamp onto the
   corresponding `Resilience_Outreach_Run__c` record.
10. Test in `DRY_RUN` first. Confirm that only the intended run changes from
    Awaiting Approval to Complete.

## Security boundary

- Slack stores the Salesforce OAuth credential in its encrypted external-auth store.
- The function obtains the credential only at runtime and never logs it.
- Salesforce authenticates the bearer token, matches the exact channel and message timestamp, and makes reactions idempotent.
- The public package contains no client secret, token, org ID, workspace ID, or real hostname.

See [the Level 3 guide](../../docs/05-closed-loop-slack-demo.md) before deploying.
