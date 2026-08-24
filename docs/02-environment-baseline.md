# Environment baseline

## Level 1

- Node.js 22+
- npm
- Current Chromium, Firefox, or Safari

## Level 2

- Salesforce CLI v2 (`sf`)
- An org with API and Apex support
- Permission to deploy metadata and create fictional records
- A user who can read/write the two sample outreach objects
- Optional: Multi-Framework on a supported Hyperforce org
- Optional: Agentforce plus an External Client App for Agent API

Run the preflight commands from `salesforce/README.md`. Do not treat the words
"demo org," "sandbox," or "Developer Edition" as a feature guarantee.

## Level 3

- A Slack workspace where you can install an internal app
- Slack CLI for hosted workflows
- Permission to create event triggers and an external OAuth connection
- A Salesforce endpoint reachable through the supported OAuth flow

Never place Slack or Salesforce tokens in this repository. Use Salesforce CLI
auth state and Slack's encrypted external-auth store.
