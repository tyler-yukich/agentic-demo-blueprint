# Contributing

Contributions are welcome when they preserve the project's three guarantees:

1. Level 1 works without Salesforce or Slack.
2. Connected behavior is clearly distinguished from simulation.
3. Public artifacts contain only newly fictional data.

Before opening a pull request, run:

```bash
npm ci
npm run verify
```

Do not submit customer-specific branding, screenshots, transcripts, URLs,
identifiers, or datasets. Add new demo records through the deterministic
fixture generator and include tests for any new agent routing behavior.
