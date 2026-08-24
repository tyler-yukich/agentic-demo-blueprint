# Sanitization standard

Public demo data must be newly authored, plausible, internally coherent, and
obviously fictional only when inspected—not because it uses unfinished labels.

Never include:

- customer or prospect names;
- real people or email addresses;
- customer products, pricing, policies, geography, or discovery quotes;
- org, workspace, channel, app, user, record, report, List, trigger, or event
  identifiers from a private implementation;
- private screenshots, recordings, transcripts, logos, or URLs;
- credentials, auth state, logs, or provider response bodies;
- private Git history.

The public repository is a clean-room implementation. Run the public-safety
script and a secret scanner over both the working tree and Git history before
every release.
