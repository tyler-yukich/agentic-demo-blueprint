/** Authenticated Slack-to-Salesforce boundary for one demo approval reaction. */
@RestResource(urlMapping='/readycurrent/slack/reaction')
global with sharing class ResilienceApprovalEndpoint {
    private static final Integer MAX_BODY_BYTES = 4096;
    private static final Pattern EVENT_ID = Pattern.compile('^Ev[A-Z0-9]{8,30}$');
    private static final Pattern USER_ID = Pattern.compile('^U[A-Z0-9]{8,20}$');
    private static final Pattern CHANNEL_ID = Pattern.compile('^[CGD][A-Z0-9]{8,20}$');
    private static final Pattern MESSAGE_TS = Pattern.compile('^[0-9]{10,16}[.][0-9]{6}$');

    /** Explicit allowlisted event contract; unknown JSON fields are rejected. */
    global class RequestBody {
        public String eventId;
        public String action;
        public String reaction;
        public String userId;
        public String channelId;
        public String messageTimestamp;
    }
    /** Minimal response DTO that never exposes implementation details. */
    global class ResponseBody {
        public Boolean accepted;
        public String reason;
    }

    /** Validates correlation and queues idempotent processing. */
    @HttpPost
    global static ResponseBody receive() {
        RestContext.response.addHeader('Content-Type', 'application/json');
        if (!hasAllowedSize()) {
            return rejected(413, 'invalid_request');
        }
        RequestBody body = parseBody();
        if (body == null) {
            return rejected(400, 'invalid_json');
        }
        if (!hasAllowedFields(body)) {
            return rejected(400, 'invalid_fields');
        }
        if (body.action != 'added' || body.reaction != 'white_check_mark') {
            return rejected(202, 'ignored_event');
        }
        Resilience_Outreach_Run__c run = findRun(body.channelId, body.messageTimestamp);
        if (run == null) {
            return rejected(404, 'unknown_message');
        }
        if (run.Reaction_Consumed__c) {
            return accepted('already_consumed');
        }
        System.enqueueJob(new ResilienceApprovalProcessor(run.Id, body.userId, 0));
        return accepted('queued');
    }

    private static Boolean hasAllowedSize() {
        return RestContext.request.requestBody != null && RestContext.request.requestBody.size() <= MAX_BODY_BYTES;
    }
    private static RequestBody parseBody() {
        try {
            return (RequestBody) JSON.deserializeStrict(RestContext.request.requestBody.toString(), RequestBody.class);
        } catch (Exception invalidPayload) {
            return null;
        }
    }
    private static Boolean hasAllowedFields(RequestBody body) {
        return matches(EVENT_ID, body.eventId) && matches(USER_ID, body.userId) &&
            matches(CHANNEL_ID, body.channelId) && matches(MESSAGE_TS, body.messageTimestamp);
    }
    private static Boolean matches(Pattern allowed, String value) {
        return value != null && allowed.matcher(value).matches();
    }
    private static Resilience_Outreach_Run__c findRun(String channelId, String messageTimestamp) {
        List<Resilience_Outreach_Run__c> runs = [
            SELECT Id, Reaction_Consumed__c FROM Resilience_Outreach_Run__c
            WHERE Request_Key__c LIKE 'readycurrent-%' AND Channel_Id__c = :channelId
                AND Slack_Message_Timestamp__c = :messageTimestamp
            WITH USER_MODE LIMIT 1
        ];
        return runs.isEmpty() ? null : runs[0];
    }
    private static ResponseBody accepted(String reason) {
        RestContext.response.statusCode = 202;
        ResponseBody response = new ResponseBody();
        response.accepted = true; response.reason = reason; return response;
    }
    private static ResponseBody rejected(Integer code, String reason) {
        RestContext.response.statusCode = code;
        ResponseBody response = new ResponseBody();
        response.accepted = false; response.reason = reason; return response;
    }
}
