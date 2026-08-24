# Truth and simulation

## Level 1

Everything is fictional and deterministic. The workflow animation does not run
Data 360. The application connectors do not call Microsoft 365. The selected
model does not change a live inference.

## Level 2

The included Salesforce records and run/draft writes can be real inside the demo
org. Scores, external signals, and segmentation remain simulated unless the
builder explicitly implements and verifies those extensions.

## Level 3

Slack review, human approval, event forwarding, Salesforce state transitions,
and status writeback can be real. Optional proof messages go to one configured test inbox,
not the displayed fictional recipient.

## Presenter language

Good: "This deterministic segment lets us prove the workflow safely; the
approval and Salesforce writeback are connected."

Bad: "Everything you see was generated live by Data 360 and the model."
