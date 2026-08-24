import { DefineOAuth2Provider, Schema } from "deno-slack-sdk/mod.ts";
import { SALESFORCE_CONSUMER_KEY, SALESFORCE_HOST } from "../config.ts";

const base = `https://${SALESFORCE_HOST}`;
const SalesforceProvider = DefineOAuth2Provider({
  provider_key: "readycurrent_salesforce",
  provider_type: Schema.providers.oauth2.CUSTOM,
  options: {
    provider_name: "ReadyCurrent Salesforce Demo",
    authorization_url: `${base}/services/oauth2/authorize`,
    token_url: `${base}/services/oauth2/token`,
    client_id: SALESFORCE_CONSUMER_KEY,
    scope: ["id", "api", "refresh_token"],
    authorization_url_extras: { prompt: "consent" },
    identity_config: {
      url: `${base}/services/oauth2/userinfo`,
      account_identifier: "$.preferred_username",
      http_method_type: "GET",
    },
    use_pkce: true,
  },
});
export default SalesforceProvider;
