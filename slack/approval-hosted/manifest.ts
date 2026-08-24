import { Manifest } from "deno-slack-sdk/mod.ts";
import SalesforceProvider from "./external_auth/salesforce_provider.ts";
import ReactionAddedWorkflow from "./workflows/reaction_added.ts";
import { SALESFORCE_HOST } from "./config.ts";

export default Manifest({
  name: "Beacon Approval Bridge",
  displayName: "Beacon Approval Bridge",
  description: "Forwards approved ReadyCurrent demo outreach to Salesforce.",
  icon: "readycurrent-mark.png",
  externalAuthProviders: [SalesforceProvider],
  workflows: [ReactionAddedWorkflow],
  outgoingDomains: [SALESFORCE_HOST],
  botScopes: ["reactions:read", "triggers:read", "triggers:write"],
});
