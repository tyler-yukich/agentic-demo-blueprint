/** Read-only controller for the connected demonstration dashboard. */
public with sharing class ReadyCurrentDemoService {
    /** Returns small aggregate metrics and the most recent outreach run. */
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getDashboard() {
        Map<String, Object> result = new Map<String, Object>();
        result.put('accountCount', [SELECT COUNT() FROM Account WITH USER_MODE LIMIT 50000]);
        result.put('draftCount', [SELECT COUNT() FROM Resilience_Outreach_Draft__c WITH USER_MODE LIMIT 50000]);
        List<Resilience_Outreach_Run__c> runs = [
            SELECT Id, Name, Status__c, Delivery_Mode__c, CreatedDate
            FROM Resilience_Outreach_Run__c WITH USER_MODE ORDER BY CreatedDate DESC LIMIT 1
        ];
        result.put('latestRun', runs.isEmpty() ? null : runs[0]);
        result.put('connected', true);
        return result;
    }
}
