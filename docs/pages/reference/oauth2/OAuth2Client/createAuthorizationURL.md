---
title: "OAuth2Client.createAuthorizationURL()"
---

# `OAuth2Client.createAuthorizationURL()`

Creates a new authorization URL. This method only supports `$256` PKCE code challenge method. By default, no scopes are included.

See [`oslo/oauth2`](/reference/oauth2) for a full example. For generating the state and code verifier, see [`generateState()`](/reference/oauth2/generateState) and [`generateCodeVerifier()`](/reference/oauth2/generateCodeVerifier) respectively.

## Definition

```ts
function createAuthorizationURL(options?: {
	state?: string;
	codeVerifier?: string;
	scopes?: string[];
}): Promise<URL>;
```

### Parameters

- `options`
  - `state`
  - `codeVerifier`: `S256` code verifier for PKCE flow
  - `scopes`: An array of scopes

## Example

```ts
//$ generateState=/reference/oauth2/generateState
//$ generateCodeVerifier=/reference/oauth2/generateCodeVerifier
import { $$generateState, $$generateCodeVerifier } from "oslo/oauth2";

const state = generateState();
const codeVerifier = generateCodeVerifier();

const url = await oauth2Client.createAuthorizationURL({
	state,
	codeVerifier,
	scopes: ["profile", "openid"]
});
```
