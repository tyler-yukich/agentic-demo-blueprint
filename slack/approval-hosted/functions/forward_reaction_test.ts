import { assertEquals, assertMatch } from "@std/assert";
import { buildReactionPayload } from "./forward_reaction.ts";
Deno.test("builds the generic approval contract", () => {
  const payload = buildReactionPayload({
    action: "added",
    userId: "USER_PLACEHOLDER",
    channelId: "CHANNEL_PLACEHOLDER",
    messageTimestamp: "1234567890.123456",
  });
  assertEquals(payload.reaction, "white_check_mark");
  assertEquals(payload.channelId, "CHANNEL_PLACEHOLDER");
  assertMatch(payload.eventId, /^Ev[A-Z0-9]{8,30}$/);
});
