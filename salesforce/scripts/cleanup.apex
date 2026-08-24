// Removes only records marked with ReadyCurrent discriminators. It never touches another demo's data.
List<Resilience_Outreach_Run__c> readyCurrentRuns = [
  SELECT Id FROM Resilience_Outreach_Run__c WHERE Request_Key__c LIKE 'readycurrent-%'
];
Set<Id> runIds = new Map<Id, Resilience_Outreach_Run__c>(readyCurrentRuns).keySet();
if (!runIds.isEmpty()) delete [SELECT Id FROM Resilience_Outreach_Draft__c WHERE Run__c IN :runIds];
if (!readyCurrentRuns.isEmpty()) delete readyCurrentRuns;

List<Contact> readyCurrentContacts = [SELECT Id FROM Contact WHERE ReadyCurrent_Demo_Key__c != null];
if (!readyCurrentContacts.isEmpty()) delete readyCurrentContacts;
List<Account> readyCurrentAccounts = [SELECT Id FROM Account WHERE ReadyCurrent_Demo_Key__c != null];
if (!readyCurrentAccounts.isEmpty()) delete readyCurrentAccounts;
System.debug('Removed only ReadyCurrent demo records.');
