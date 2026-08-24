# Security and demo-data policy

This repository is an educational demonstration, not a production email or
emergency-notification service.

## Non-negotiable boundaries

- Every company, person, address, product, transaction, and message is newly
  fictional.
- Never import customer, employee, household, or production data.
- Never commit OAuth tokens, session IDs, passwords, certificates, private
  keys, `.env` files, Salesforce auth state, or Slack auth state.
- Level 3 defaults to dry-run or run-owner delivery. Displayed fictional
  recipient addresses must never be passed to an email provider.
- Do not use this sample for safety-critical dispatch, medical, legal, utility,
  or emergency communications.

## Reporting

If you find a security issue, do not open a public issue containing exploit
details or credentials. Use GitHub's private security-advisory flow for this
repository.
