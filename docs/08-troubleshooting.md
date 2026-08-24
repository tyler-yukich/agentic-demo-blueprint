# Troubleshooting

| Symptom | Check first | Recovery |
|---|---|---|
| Blank local page | Browser console and Node version | `npm ci`, then `npm run dev` |
| Fixture check fails | Generated fixture drift | Review generator, then intentionally run `npm run fixtures:write` |
| UI Bundle does not serve | Org support and Salesforce App domain | Use supported org or embedded LWC path |
| Embedded CSS differs | Scoped reset and style order | Keep embedded overrides last |
| Run or draft change does not persist | Permission set and Apex error | Run focused test and inspect safe debug output |
| Beacon routes incorrectly | Intent anchors and collision tests | Add the failing utterance as a test before changing order |
| Live reply is unformatted | Response outside renderer subset | Normalize into paragraphs/lists/tables |
| Slack event never arrives | App install, trigger, membership, reaction scope | Inspect Slack activity without printing auth data |
| Event arrives but Salesforce rejects it | OAuth connection and REST contract | Reauthorize and compare minimal field names |
| Duplicate processing | Missing idempotency/consumed state | Stop trigger and repair state before retrying |

When diagnosing authentication, never print a token or full provider response.
Report status codes and safe error names only.
