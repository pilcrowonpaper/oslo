---
type: "method"
---

# `OAuth2Client.createAuthorizationURL()`

Creates a new authorization URL. This method only supports `$256` PKCE code challenge method. By default, no scopes are included.

See [`oslo/oauth2`](/reference/oauth2) for a full example. For generating the state and code verifier, see [`generateState()`](ref:oauth2) and [`generateCodeVerifier()`](ref:oauth2) respectively.

## Definition

```ts
function createAuthorizationURL(options?: {
	state?: string;
	codeVerifier?: string;
	scope?: string[];
}): Promise<URL>;
```

### Parameters

- `options`
  - `state`: OAuth state
  - `codeVerifier`: `S256` code verifier for PKCE flow
  - `scope`: An array of scopes

## Example

```ts
//$ oauth2Client=ref:/reference/oauth2/OAuth2Client
const url = await $$oauth2Client.createAuthorizationURL({
	state,
	codeVerifier,
	scope: ["profile", "openid"]
});
```
