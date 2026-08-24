/** Read-only controller scoped to records carrying the ReadyCurrent discriminator. */
public with sharing class ReadyCurrentDemoService {
    /** Returns only ReadyCurrent aggregates, never totals from another demo in the org. */
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getDashboard() {
        Map<String, Object> result = new Map<String, Object>();
        result.put('accountCount', [
            SELECT COUNT() FROM Account WHERE ReadyCurrent_Demo_Key__c != null WITH USER_MODE
        ]);
        result.put('atRiskCount', [
            SELECT COUNT() FROM Account
            WHERE ReadyCurrent_Demo_Key__c != null AND ReadyCurrent_Outage_Exposure__c = 'Elevated'
            WITH USER_MODE
        ]);
        result.put('eligibleCount', [
            SELECT COUNT() FROM Account
            WHERE ReadyCurrent_Demo_Key__c != null AND ReadyCurrent_Credit_Eligible__c = true
            WITH USER_MODE
        ]);
        result.put('draftCount', [
            SELECT COUNT() FROM Resilience_Outreach_Draft__c
            WHERE Run__r.Request_Key__c LIKE 'readycurrent-%' WITH USER_MODE
        ]);
        List<Resilience_Outreach_Run__c> runs = [
            SELECT Id, Name, Status__c, Delivery_Mode__c, CreatedDate
            FROM Resilience_Outreach_Run__c
            WHERE Request_Key__c LIKE 'readycurrent-%'
            WITH USER_MODE ORDER BY CreatedDate DESC LIMIT 1
        ];
        result.put('latestRun', runs.isEmpty() ? null : runs[0]);
        result.put('latestRunStatus', runs.isEmpty() ? null : runs[0].Status__c);
        result.put('connected', true);
        return result;
    }
}
