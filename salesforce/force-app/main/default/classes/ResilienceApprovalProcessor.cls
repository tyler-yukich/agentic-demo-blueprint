/** Processes approved demo drafts in bounded, idempotent Queueable batches. */
public with sharing class ResilienceApprovalProcessor implements Queueable {
    private static final Integer BATCH_SIZE = 10;
    private Id runId;
    private String approverId;
    private Integer processedCount;

    /** Creates one batch processor without storing credentials. */
    public ResilienceApprovalProcessor(Id runId, String approverId, Integer processedCount) {
        this.runId = runId;
        this.approverId = approverId;
        this.processedCount = processedCount;
    }

    /** Runs at most ten messages and chains only when approved rows remain. */
    public void execute(QueueableContext context) {
        Resilience_Outreach_Run__c run = loadRun();
        if (run.Reaction_Consumed__c && processedCount == 0) {
            return;
        }
        if (processedCount == 0) {
            beginRun(run);
        }
        List<Resilience_Outreach_Draft__c> drafts = loadDrafts();
        if (!isDeliveryConfigurationValid(run)) {
            failRun(run);
            return;
        }
        if (run.Delivery_Mode__c == 'TEST_INBOX') {
            sendProofMessages(run, drafts);
        }
        markDraftsSent(drafts);
        continueOrComplete(run, drafts.size());
    }

    private Resilience_Outreach_Run__c loadRun() {
        return [
            SELECT Id, Status__c, Delivery_Mode__c, Test_Delivery_Email__c, Reaction_Consumed__c
            FROM Resilience_Outreach_Run__c WHERE Id = :runId WITH USER_MODE FOR UPDATE
        ];
    }
    private void beginRun(Resilience_Outreach_Run__c run) {
        run.Reaction_Consumed__c = true;
        run.Approver_User_Id__c = approverId;
        run.Status__c = 'Processing';
        Database.update(run, AccessLevel.USER_MODE);
    }
    private List<Resilience_Outreach_Draft__c> loadDrafts() {
        return [
            SELECT Id, Recipient_Display__c, Subject__c, Body__c, Status__c
            FROM Resilience_Outreach_Draft__c WHERE Run__c = :runId AND Status__c = 'Approved'
            WITH USER_MODE ORDER BY Rank__c LIMIT :BATCH_SIZE
        ];
    }
    private static Boolean isDeliveryConfigurationValid(Resilience_Outreach_Run__c run) {
        return run.Delivery_Mode__c != 'TEST_INBOX' || !String.isBlank(run.Test_Delivery_Email__c);
    }
    private static void failRun(Resilience_Outreach_Run__c run) {
        run.Status__c = 'Failed';
        run.Last_Error__c = 'TEST_INBOX requires one configured test delivery address.';
        Database.update(run, AccessLevel.USER_MODE);
    }
    private static void sendProofMessages(Resilience_Outreach_Run__c run, List<Resilience_Outreach_Draft__c> drafts) {
        List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
        for (Resilience_Outreach_Draft__c draft : drafts) {
            Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
            message.setToAddresses(new List<String>{ run.Test_Delivery_Email__c });
            message.setSubject('[DEMO for ' + draft.Recipient_Display__c + '] ' + draft.Subject__c);
            message.setPlainTextBody(draft.Body__c);
            message.setSaveAsActivity(false);
            messages.add(message);
        }
        if (!messages.isEmpty()) {
            Messaging.sendEmail(messages, false);
        }
    }
    private static void markDraftsSent(List<Resilience_Outreach_Draft__c> drafts) {
        for (Resilience_Outreach_Draft__c draft : drafts) {
            draft.Status__c = 'Sent';
        }
        if (!drafts.isEmpty()) {
            Database.update(drafts, AccessLevel.USER_MODE);
        }
    }
    private void continueOrComplete(Resilience_Outreach_Run__c run, Integer batchCount) {
        Integer remaining = [
            SELECT COUNT() FROM Resilience_Outreach_Draft__c
            WHERE Run__c = :runId AND Status__c = 'Approved' WITH USER_MODE
        ];
        if (remaining > 0) {
            System.enqueueJob(new ResilienceApprovalProcessor(runId, approverId, processedCount + batchCount));
        } else {
            run.Status__c = 'Complete';
            Database.update(run, AccessLevel.USER_MODE);
        }
    }
}
