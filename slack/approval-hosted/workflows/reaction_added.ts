import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ForwardReactionDefinition } from "../functions/forward_reaction.ts";
export const ReactionAddedWorkflow = DefineWorkflow({
  callback_id: "beacon_reaction_added",
  title: "Beacon approval added",
  description: "Immediately forwards a Beacon approval reaction to Salesforce.",
  input_parameters: {
    properties: {
      userId: { type: Schema.slack.types.user_id },
      channelId: { type: Schema.slack.types.channel_id },
      messageTimestamp: { type: Schema.types.string },
    },
    required: ["userId", "channelId", "messageTimestamp"],
  },
});
ReactionAddedWorkflow.addStep(ForwardReactionDefinition, {
  salesforceAccessTokenId: { credential_source: "DEVELOPER" },
  action: "added",
  userId: ReactionAddedWorkflow.inputs.userId,
  channelId: ReactionAddedWorkflow.inputs.channelId,
  messageTimestamp: ReactionAddedWorkflow.inputs.messageTimestamp,
});
export default ReactionAddedWorkflow;
