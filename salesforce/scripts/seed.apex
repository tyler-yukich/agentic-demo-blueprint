// Run only in a disposable demo org. Every name and address below is fictional.
List<Account> accounts = new List<Account>();
for (Integer i = 1; i <= 100; i++) accounts.add(new Account(Name = 'ReadyCurrent Fixture Account ' + String.valueOf(i).leftPad(3, '0')));
insert accounts;
List<Contact> contacts = new List<Contact>();
for (Integer i = 0; i < accounts.size(); i++) contacts.add(new Contact(FirstName = 'Demo', LastName = 'Contact ' + (i + 1), Email = 'demo.contact' + (i + 1) + '@readycurrent.example', AccountId = accounts[i].Id));
insert contacts;
Resilience_Outreach_Run__c run = new Resilience_Outreach_Run__c(Request_Key__c = 'readycurrent-seed', Status__c = 'Awaiting Approval', Delivery_Mode__c = 'DRY_RUN');
insert run;
List<Resilience_Outreach_Draft__c> drafts = new List<Resilience_Outreach_Draft__c>();
for (Integer i = 0; i < 21; i++) drafts.add(new Resilience_Outreach_Draft__c(Run__c = run.Id, Account__c = accounts[i].Id, Contact__c = contacts[i].Id, Recipient_Display__c = contacts[i].Email, Subject__c = 'A continuity option for ' + accounts[i].Name, Body__c = 'Hello Demo,\n\nA fictional grid-risk signal suggests it may be useful to review your backup-power plan. This message is demonstration data and was not sent to a real recipient.\n\nRegards,\nAvery', Status__c = 'Approved', Rank__c = i + 1));
insert drafts;
System.debug('Seeded 100 fictional accounts and 21 dry-run drafts.');
