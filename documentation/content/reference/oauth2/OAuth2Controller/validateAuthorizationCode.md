---
type: "method"
---

# `OAuth2Controller.validateAuthorizationCode()`

Validates the authorization code included in the callback. This sends a POST request (`application/x-www-form-urlencoded`) to the token endpoint defined when initializing [`OAuth2Controller`](ref:oauth2) and returns the JSON-parsed response body. You can define the request body type with `_TokenResponseBody` type parameter.

By default, credentials (client secret) is sent via the HTTP basic auth scheme. To send it inside the request body (ie. search params), set `options.authenticateWith` to `"request_body"`.

This throws a [`TokenRequestError`](ref:oauth2) on error responses, and `fetch()` error when it fails to connect to the endpoint.

See [`oslo/oauth2`](/reference/oauth2) for a full example.

## Definition

```ts
function validateAuthorizationCode<_TokenResponseBody extends TokenResponseBody>(
	authorizationCode: string,
	options?: {
		codeVerifier?: string;
		credentials?: string;
		authenticateWith?: "http_basic_auth" | "request_body";
	}
): Promise<_TokenResponseBody>;
```

### Parameters

- `authorizationCode`: `code` param in callback request
- `options`
  - `codeVerifier`: Stored code verifier for PKCE flow
  - `credentials`: Client password or secret for authenticated requests
  - `authenticateWith` (default: `"http_basic_auth"`): How the credentials should be sent

### Type parameters

- `_TokenResponseBody`: JSON-parsed success response body from the token endpoint

## Example

```ts
//$ TokenRequestError=ref:oauth2
//$ TokenResponseBody=ref:oauth2
//$ oauth2Controller=/reference/oauth2/OAuth2Controller
import { $$TokenRequestError } from "oslo/oauth2";
import type { $$TokenResponseBody } from "oslo/oauth2";

interface ResponseBody extends TokenResponseBody {
	refresh_token: string;
}
try {
	const tokens = await $$oauth2Controller.validateAuthorizationCode<ResponseBody>(code, {
		codeVerifier: storedCodeVerifier,
		credentials: clientSecret,
		authenticateWith: "request_body" // send client secret inside body
	});
} catch (e) {
	if (e instanceof TokenRequestError) {
		// invalid credentials etc
	}
	// unknown error
}
```
