---
type: "module"
---

# `oslo/oauth2`

Provides utilities for working OAuth 2.0.

## Functions

- [`generateCodeVerifier()`](ref:oauth2)
- [`generateState()`](ref:oauth2)

## Classes

- [`OAuth2Client`](ref:oauth2)
- [`OAuth2RequestError`](ref:oauth2)

## Interfaces

- [`TokenResponseBody`](ref:oauth2)

## Types

- [`ResponseMode`](ref:oauth2)

## Example

```ts
import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

const oauth2Client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
	redirectURI: "http://localhost:3000/login/github/callback"
});
```

### Create an authorization URL

```ts
import { generateState } from "oslo/oauth2";

const state = generateState();

const url = await createAuthorizationURL({
	scope: ["user:email"]
});
url.searchParams.set("state", state);
```

It also supports the PKCE flow:

```ts
import { generateState, generateCodeVerifier } from "oslo/oauth2";

const codeVerifier = generateCodeVerifier(); // for PKCE flow
const state = generateState();

const url = await createAuthorizationURL({
	scope: ["user:email"],
	codeVerifier
});
url.searchParams.set("state", state);
```

### Validate an authorization code

By default [`OAuth2Client.validateAuthorizationCode()`](ref:oauth2) sends credentials with the HTTP basic auth scheme.

```ts
import { OAuth2RequestError } from "oslo/oauth2";

if (!storedState || !state || storedState !== state) {
	// error
}

// ...

try {
	const { accessToken, refreshToken } = await oauth2Client.validateAuthorizationCode<{
		refreshToken: string;
	}>(code, {
		credentials: clientSecret,
		authenticateWith: "request_body"
	});
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// see https://www.rfc-editor.org/rfc/rfc6749#section-5.2
		const { request, message, description } = e;
	}
	// unknown error
}
```

This also supports the PKCE flow:

```ts
await oauth2Client.validateAuthorizationCode<{
	refreshToken: string;
}>(code, {
	credentials: clientSecret,
	codeVerifier
});
```

### Refresh an access token

```ts
import { OAuth2RequestError } from "oslo/oauth2";

try {
	const { accessToken, refreshToken } = await oauth2Client.refreshAccessToken<{
		refreshToken: string;
	}>(code, {
		credentials: clientSecret,
		authenticateWith: "request_body"
	});
} catch (e) {
	if (e instanceof OAuth2RequestError) {
		// see https://www.rfc-editor.org/rfc/rfc6749#section-5.2
		const { request, message, description } = e;
	}
	// unknown error
}
```
