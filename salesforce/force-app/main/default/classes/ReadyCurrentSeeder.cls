/** Idempotently installs only fictional records marked with ReadyCurrent discriminator keys. */
public with sharing class ReadyCurrentSeeder {
    private static final String REQUEST_KEY = 'readycurrent-seed-v1';

    private class FixturePayload {
        public List<FixtureAccount> accounts;
    }
    private class FixtureAccount {
        public String name;
        public String segment;
        public String city;
        public String region;
        public String contactName;
        public String email;
        public String installedProduct;
        public String monitoringPlan;
        public Integer lastPlanActiveDaysAgo;
        public String outageExposure;
        public Boolean resilienceCreditEligible;
        public Decimal annualValue;
    }

    /** Upserts 100 accounts and contacts, then recreates the 21 approved dry-run drafts. */
    public static void seed() {
        FixturePayload fixture = loadFixture();
        if (fixture.accounts == null || fixture.accounts.size() != 100) {
            throw new ReadyCurrentSeedException('The ReadyCurrent fixture must contain exactly 100 accounts.');
        }
        List<Account> accounts = buildAccounts(fixture.accounts);
        Database.UpsertResult[] accountResults = Database.upsert(
            accounts, Account.Fields.ReadyCurrent_Demo_Key__c, false, AccessLevel.USER_MODE
        );
        assertSuccessful(accountResults, 'account');
        Map<String, Account> accountsByKey = loadAccountsByKey();

        List<Contact> contacts = buildContacts(fixture.accounts, accountsByKey);
        Database.UpsertResult[] contactResults = Database.upsert(
            contacts, Contact.Fields.ReadyCurrent_Demo_Key__c, false, AccessLevel.USER_MODE
        );
        assertSuccessful(contactResults, 'contact');
        Map<String, Contact> contactsByKey = loadContactsByKey();

        Resilience_Outreach_Run__c run = upsertRun();
        List<Resilience_Outreach_Draft__c> oldDrafts = [
            SELECT Id FROM Resilience_Outreach_Draft__c WHERE Run__c = :run.Id WITH USER_MODE
        ];
        if (!oldDrafts.isEmpty()) Database.delete(oldDrafts, false, AccessLevel.USER_MODE);
        List<Resilience_Outreach_Draft__c> drafts = buildDrafts(fixture.accounts, accountsByKey, contactsByKey, run.Id);
        Database.SaveResult[] draftResults = Database.insert(drafts, false, AccessLevel.USER_MODE);
        assertSuccessful(draftResults, 'draft');
    }

    private static FixturePayload loadFixture() {
        StaticResource fixtureResource = [
            SELECT Body FROM StaticResource WHERE Name = 'ReadyCurrentFixtures' LIMIT 1
        ];
        return (FixturePayload) JSON.deserialize(fixtureResource.Body.toString(), FixturePayload.class);
    }

    private static List<Account> buildAccounts(List<FixtureAccount> fixtures) {
        List<Account> records = new List<Account>();
        for (Integer index = 0; index < fixtures.size(); index++) {
            FixtureAccount item = fixtures[index];
            records.add(new Account(
                ReadyCurrent_Demo_Key__c = accountKey(index), Name = item.name,
                ReadyCurrent_Segment__c = item.segment, ReadyCurrent_City__c = item.city,
                ReadyCurrent_Region__c = item.region, ReadyCurrent_Outage_Exposure__c = item.outageExposure,
                ReadyCurrent_Credit_Eligible__c = item.resilienceCreditEligible,
                ReadyCurrent_Annual_Value__c = item.annualValue,
                ReadyCurrent_Installed_Product__c = item.installedProduct,
                ReadyCurrent_Monitoring_Plan__c = item.monitoringPlan,
                ReadyCurrent_Last_Active_Days__c = item.lastPlanActiveDaysAgo
            ));
        }
        return records;
    }

    private static List<Contact> buildContacts(List<FixtureAccount> fixtures, Map<String, Account> accountsByKey) {
        List<Contact> records = new List<Contact>();
        for (Integer index = 0; index < fixtures.size(); index++) {
            FixtureAccount item = fixtures[index];
            Integer splitAt = item.contactName.lastIndexOf(' ');
            records.add(new Contact(
                ReadyCurrent_Demo_Key__c = contactKey(index),
                FirstName = item.contactName.substring(0, splitAt), LastName = item.contactName.substring(splitAt + 1),
                Email = item.email, AccountId = accountsByKey.get(accountKey(index)).Id
            ));
        }
        return records;
    }

    private static Resilience_Outreach_Run__c upsertRun() {
        Resilience_Outreach_Run__c run = new Resilience_Outreach_Run__c(
            Request_Key__c = REQUEST_KEY, Status__c = 'Awaiting Approval', Delivery_Mode__c = 'DRY_RUN',
            Reaction_Consumed__c = false, Channel_Id__c = null, Slack_Message_Timestamp__c = null,
            Approver_User_Id__c = null, Last_Error__c = null
        );
        Database.UpsertResult result = Database.upsert(
            run, Resilience_Outreach_Run__c.Fields.Request_Key__c, AccessLevel.USER_MODE
        );
        if (!result.isSuccess()) throw new ReadyCurrentSeedException('Unable to upsert the ReadyCurrent run.');
        return [SELECT Id FROM Resilience_Outreach_Run__c WHERE Request_Key__c = :REQUEST_KEY WITH USER_MODE LIMIT 1];
    }

    private static List<Resilience_Outreach_Draft__c> buildDrafts(
        List<FixtureAccount> fixtures, Map<String, Account> accountsByKey,
        Map<String, Contact> contactsByKey, Id runId
    ) {
        List<Resilience_Outreach_Draft__c> drafts = new List<Resilience_Outreach_Draft__c>();
        for (Integer index = 0; index < fixtures.size(); index++) {
            FixtureAccount item = fixtures[index];
            if (!item.resilienceCreditEligible) continue;
            Contact contact = contactsByKey.get(contactKey(index));
            String firstName = contact.FirstName?.substringBefore(' ') ?? contact.FirstName;
            drafts.add(new Resilience_Outreach_Draft__c(
                Run__c = runId, Account__c = accountsByKey.get(accountKey(index)).Id, Contact__c = contact.Id,
                Recipient_Display__c = item.email, Rank__c = drafts.size() + 1,
                Subject__c = 'A resilience option for ' + item.name,
                Body__c = 'Hello ' + firstName + ',\n\nA regional grid-risk signal suggests ' + item.name +
                    ' may benefit from reviewing its ' + item.installedProduct +
                    ' continuity plan. Your fictional account qualifies for the staged ReadyCurrent Resilience Credit. ' +
                    'I prepared this draft for review; it has not been sent to a real recipient.\n\nRegards,\nAvery',
                Status__c = 'Approved'
            ));
        }
        return drafts;
    }

    private static Map<String, Account> loadAccountsByKey() {
        Map<String, Account> result = new Map<String, Account>();
        for (Account record : [
            SELECT Id, ReadyCurrent_Demo_Key__c FROM Account WHERE ReadyCurrent_Demo_Key__c != null WITH USER_MODE
        ]) result.put(record.ReadyCurrent_Demo_Key__c, record);
        return result;
    }

    private static Map<String, Contact> loadContactsByKey() {
        Map<String, Contact> result = new Map<String, Contact>();
        for (Contact record : [
            SELECT Id, FirstName, ReadyCurrent_Demo_Key__c FROM Contact
            WHERE ReadyCurrent_Demo_Key__c != null WITH USER_MODE
        ]) result.put(record.ReadyCurrent_Demo_Key__c, record);
        return result;
    }

    private static String accountKey(Integer zeroBasedIndex) {
        return 'RC-ACC-' + String.valueOf(zeroBasedIndex + 1).leftPad(3, '0');
    }
    private static String contactKey(Integer zeroBasedIndex) {
        return 'RC-CON-' + String.valueOf(zeroBasedIndex + 1).leftPad(3, '0');
    }
    private static void assertSuccessful(Database.SaveResult[] results, String recordType) {
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) throw new ReadyCurrentSeedException('Unable to upsert a ReadyCurrent ' + recordType + '.');
        }
    }
    private static void assertSuccessful(Database.UpsertResult[] results, String recordType) {
        for (Database.UpsertResult result : results) {
            if (!result.isSuccess()) throw new ReadyCurrentSeedException('Unable to upsert a ReadyCurrent ' + recordType + '.');
        }
    }

    public class ReadyCurrentSeedException extends Exception {}
}
