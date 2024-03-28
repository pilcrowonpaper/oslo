---
title: "OAuth2Client.createAuthorizationURL()"
---

# `OAuth2Client.createAuthorizationURL()`

Creates a new authorization URL. This method supports both `plain` and `S256` PKCE code challenge methods. By default, no scopes are included.

See [`oslo/oauth2`](/reference/oauth2) for a full example. For generating the state and code verifier, see [`generateState()`](/reference/oauth2/generateState) and [`generateCodeVerifier()`](/reference/oauth2/generateCodeVerifier) respectively.

## Definition

```ts
function createAuthorizationURL(options?: {
	state?: string;
	codeChallengeMethod?: "S256" | "plain";
	codeVerifier?: string;
	scopes?: string[];
}): Promise<URL>;
```

### Parameters

- `options`
  - `state`
  - `codeVerifier`: Code verifier for PKCE flow
  - `codeChallengeMethod` (default: `"S256"`): Ignored if `codeVerifier` is undefined
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
