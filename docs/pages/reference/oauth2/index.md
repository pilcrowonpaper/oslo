---
title: "oslo/oauth2"
---

# `oslo/oauth2`

Provides utilities for working OAuth 2.0 based on [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) and [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636). Can be used for OpenID Connect.

## Functions

- [`generateCodeVerifier()`](/reference/oauth2/generateCodeVerifier)
- [`generateState()`](/reference/oauth2/generateState)

## Classes

- [`OAuth2Client`](/reference/oauth2/OAuth2Client)
- [`OAuth2RequestError`](/reference/oauth2/OAuth2RequestError)

## Interfaces

- [`TokenResponseBody`](/reference/oauth2/TokenResponseBody)

## Types

- [`ResponseMode`](/reference/oauth2/ResponseMode)

## Example

```ts
import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

const client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
	redirectURI: "http://localhost:3000/login/github/callback"
});
```

### Create an authorization URL

```ts
import { generateState } from "oslo/oauth2";

const state = generateState();

const url = await client.createAuthorizationURL({
	state,
	scopes: ["user:email"]
});
```

It also supports the PKCE flow:

```ts
import { generateState, generateCodeVerifier } from "oslo/oauth2";

const state = generateState();
const codeVerifier = generateCodeVerifier();

// S256 method by default
const url = await client.createAuthorizationURL({
	state,
	scopes: ["user:email"],
	codeVerifier
});
```

### Validate an authorization code

By default [`OAuth2Client.validateAuthorizationCode()`](/reference/oauth2/OAuth2Client/validateAuthorizationCode) sends credentials with the HTTP basic auth scheme.

```ts
import { OAuth2RequestError } from "oslo/oauth2";

if (!storedState || !state || storedState !== state) {
	// error
}

// ...

try {
	const { accessToken, refreshToken } = await client.validateAuthorizationCode<{
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
await client.validateAuthorizationCode<{
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
	const { accessToken, refreshToken } = await client.refreshAccessToken<{
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
