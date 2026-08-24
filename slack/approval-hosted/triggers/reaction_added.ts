import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import { ReactionAddedWorkflow } from "../workflows/reaction_added.ts";
import { APPROVAL_CHANNEL_ID } from "../config.ts";
const trigger: Trigger<typeof ReactionAddedWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Beacon green-check approval",
  description: "Starts delivery immediately after an approval reaction.",
  workflow: `#/workflows/${ReactionAddedWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: [APPROVAL_CHANNEL_ID],
    filter: {
      version: 1,
      root: { statement: "{{data.reaction}} == white_check_mark" },
    },
  },
  inputs: {
    userId: { value: TriggerContextData.Event.ReactionAdded.user_id },
    channelId: { value: TriggerContextData.Event.ReactionAdded.channel_id },
    messageTimestamp: {
      value: TriggerContextData.Event.ReactionAdded.message_ts,
    },
  },
};
export default trigger;
