---
type: "method"
---

# `OAuth2Controller.createAuthorizationURL()`

Creates a new authorization URL. This method only supports `$256` PKCE code challenge method. See [`oslo/oauth2`](/reference/oauth2) for a full example.

For generating the state and code verifier, see [`generateState()`](ref:oauth2) and [`generateCodeVerifier()`](ref:oauth2) respectively.

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
