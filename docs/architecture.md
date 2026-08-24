# Architecture

## Design principles

1. The business story is one continuous workflow.
2. UI components consume stable view models, not Salesforce objects directly.
3. Fixtures and connected data meet at one explicit boundary.
4. Deterministic and live agent modes share one presentation surface.
5. Human approval is persisted separately from batch execution.
6. Events are correlated and idempotent.
7. Proof delivery is safe by construction.

## Component boundaries

- `src/data`: fictional view models and deterministic fixture output.
- `src/lib/agent.ts`: staged reasoning and tool-sensitive composition.
- `src/components`: reusable cards, profiles, workflow, and assistant UI.
- `salesforce`: run/draft state, record access, safe proof processing, and REST boundary.
- `slack/approval-hosted`: instant event transport; no business state.

The Slack function should remain thin. Salesforce owns which run a message
belongs to, whether a reaction was consumed, which drafts are approved, and
whether a row has already completed.
