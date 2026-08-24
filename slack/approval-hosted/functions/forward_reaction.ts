import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SALESFORCE_HOST } from "../config.ts";

export const ForwardReactionDefinition = DefineFunction({
  callback_id: "forward_beacon_reaction",
  title: "Forward Beacon approval reaction",
  description: "Sends one approval event to Salesforce.",
  source_file: "functions/forward_reaction.ts",
  input_parameters: {
    properties: {
      salesforceAccessTokenId: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "readycurrent_salesforce",
      },
      action: { type: Schema.types.string },
      userId: { type: Schema.slack.types.user_id },
      channelId: { type: Schema.slack.types.channel_id },
      messageTimestamp: { type: Schema.types.string },
    },
    required: [
      "salesforceAccessTokenId",
      "action",
      "userId",
      "channelId",
      "messageTimestamp",
    ],
  },
  output_parameters: {
    properties: { accepted: { type: Schema.types.boolean } },
    required: ["accepted"],
  },
});

export function buildReactionPayload(
  inputs: {
    action: string;
    userId: string;
    channelId: string;
    messageTimestamp: string;
  },
) {
  const stable = `${inputs.action}${inputs.messageTimestamp}`.replaceAll(
    /[^A-Za-z0-9]/g,
    "",
  ).toUpperCase().slice(0, 28);
  return {
    action: inputs.action,
    eventId: `Ev${stable}`,
    userId: inputs.userId,
    reaction: "white_check_mark",
    channelId: inputs.channelId,
    messageTimestamp: inputs.messageTimestamp,
  };
}

export default SlackFunction(
  ForwardReactionDefinition,
  async ({ inputs, client }) => {
    const token = await client.apps.auth.external.get({
      external_token_id: inputs.salesforceAccessTokenId,
    });
    if (token.error || !token.external_token) {
      return {
        error: "Salesforce authorization is unavailable.",
      };
    }
    const response = await fetch(
      `https://${SALESFORCE_HOST}/services/apexrest/readycurrent/slack/reaction`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.external_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildReactionPayload(inputs)),
      },
    );
    if (response.status !== 202) {
      return {
        error: `Salesforce rejected the reaction (${response.status}).`,
      };
    }
    const result = await response.json();
    if (result?.accepted !== true) {
      return {
        error: "Salesforce did not accept the reaction.",
      };
    }
    return { outputs: { accepted: true } };
  },
);
