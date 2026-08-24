@IsTest
private class ReadyCurrentDemoTest {
    @TestSetup static void setupData() {
        Account account = new Account(Name = 'Cedar Peak Co-op');
        insert account;
        Contact contact = new Contact(FirstName = 'Nora', LastName = 'Chen', Email = 'nora.chen@cedarpeak.example', AccountId = account.Id);
        insert contact;
        Resilience_Outreach_Run__c run = new Resilience_Outreach_Run__c(
            Request_Key__c = 'fixture-run', Channel_Id__c = 'C' + '12345678', Slack_Message_Timestamp__c = '1234567890.123456'
        );
        insert run;
        List<Resilience_Outreach_Draft__c> drafts = new List<Resilience_Outreach_Draft__c>();
        for (Integer i = 1; i <= 3; i++) {
            drafts.add(new Resilience_Outreach_Draft__c(
                Run__c = run.Id, Account__c = account.Id, Contact__c = contact.Id, Recipient_Display__c = contact.Email,
                Subject__c = 'Continuity plan ' + i, Body__c = 'Hello Nora. This is fictional demo copy.', Status__c = 'Approved', Rank__c = i
            ));
        }
        insert drafts;
    }
    @IsTest static void dashboardReadsConnectedRecords() {
        Map<String, Object> dashboard = ReadyCurrentDemoService.getDashboard();
        Assert.areEqual(true, dashboard.get('connected'), 'Connected flag should be true.');
        Assert.areEqual(3, dashboard.get('draftCount'), 'Three fixture drafts should be visible.');
    }
    @IsTest static void reactionQueuesDryRun() {
        RestRequest request = new RestRequest();
        request.requestUri = '/services/apexrest/readycurrent/slack/reaction';
        request.httpMethod = 'POST';
        request.requestBody = Blob.valueOf('{"eventId":"EvFIXTURE123","action":"added","reaction":"white_check_mark","userId":"U' + '12345678' + '","channelId":"C' + '12345678' + '","messageTimestamp":"1234567890.123456"}');
        RestContext.request = request;
        RestContext.response = new RestResponse();
        Test.startTest();
        ResilienceApprovalEndpoint.ResponseBody response = ResilienceApprovalEndpoint.receive();
        Test.stopTest();
        Assert.areEqual(true, response.accepted, 'Valid reaction should be accepted.');
        Assert.areEqual('Complete', [SELECT Status__c FROM Resilience_Outreach_Run__c LIMIT 1].Status__c, 'Dry run should complete.');
        Assert.areEqual(3, [SELECT COUNT() FROM Resilience_Outreach_Draft__c WHERE Status__c = 'Sent'], 'Approved drafts should be consumed once.');
    }
    @IsTest static void rejectsUnknownMessage() {
        RestRequest request = new RestRequest();
        request.requestBody = Blob.valueOf('{"eventId":"EvUNKNOWN123","action":"added","reaction":"white_check_mark","userId":"U' + '12345678' + '","channelId":"C' + '87654321' + '","messageTimestamp":"1234567899.999999"}');
        RestContext.request = request;
        RestContext.response = new RestResponse();
        ResilienceApprovalEndpoint.ResponseBody response = ResilienceApprovalEndpoint.receive();
        Assert.areEqual(false, response.accepted, 'Unknown correlation should be denied.');
        Assert.areEqual(404, RestContext.response.statusCode, 'Unknown message should return not found.');
    }
    @IsTest static void rejectsMalformedJson() {
        RestRequest request = new RestRequest();
        request.requestBody = Blob.valueOf('{"unexpected":true}');
        RestContext.request = request;
        RestContext.response = new RestResponse();
        ResilienceApprovalEndpoint.ResponseBody response = ResilienceApprovalEndpoint.receive();
        Assert.areEqual(false, response.accepted, 'Unknown fields must be denied.');
        Assert.areEqual(400, RestContext.response.statusCode, 'Malformed contracts return bad request.');
    }
}
