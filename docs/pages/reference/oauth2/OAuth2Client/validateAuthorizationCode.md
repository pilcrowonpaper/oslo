---
title: "OAuth2Client.validateAuthorizationCode()"
---

# `OAuth2Client.validateAuthorizationCode()`

Validates the authorization code included in the callback. This sends a POST request (`application/x-www-form-urlencoded`) to the token endpoint defined when initializing [`OAuth2Client`](/reference/oauth2/OAuth2Client) and returns the JSON-parsed response body. You can define the request body type with `_TokenResponseBody` type parameter.

By default, credentials (client secret) is sent via the HTTP basic auth scheme. To send it inside the request body (ie. search params), set `options.authenticateWith` to `"request_body"`.

This throws a [`OAuth2RequestError`](/reference/oauth2/OAuth2RequestError) on error responses, and `fetch()` error when it fails to connect to the endpoint.

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
//$ OAuth2RequestError=/reference/oauth2/OAuth2RequestError
//$ TokenResponseBody=/reference/oauth2/TokenResponseBody
//$ oauth2Client=/reference/oauth2/OAuth2Client
import { $$OAuth2RequestError } from "oslo/oauth2";
import type { $$TokenResponseBody } from "oslo/oauth2";

interface ResponseBody extends TokenResponseBody {
	refresh_token: string;
}
try {
	const tokens = await $$oauth2Client.validateAuthorizationCode<ResponseBody>(code, {
		codeVerifier: storedCodeVerifier,
		credentials: clientSecret,
		authenticateWith: "request_body" // send client secret inside body
	});
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// invalid credentials etc
	}
	// unknown error
}
```
