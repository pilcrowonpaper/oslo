---
type: "module"
---

## Example

```ts
import { OAuth2Controller } from "oslo/oauth2";

const authorizeEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

const oauth2Controller = new OAuth2Controller(clientId, authorizeEndpoint, tokenEndpoint, {
	// optional
	redirectURI: "http://localhost:3000/login/github/callback"
});
```

### Create authorization URL

```ts
import { generateState } from "oslo/oauth2";

const state = generateState();

const url = await createAuthorizationURL({
	state,
	scope: ["user:email"]
});
```

It also supports the PKCE flow:

```ts
import { generateState, generateCodeVerifier } from "oslo/oauth2";

const state = generateState();
const codeVerifier = generateCodeVerifier(); // for PKCE flow

const url = await createAuthorizationURL({
	state,
	scope: ["user:email"],
	codeVerifier
});
```

### Validate authorization code

By default [`OAuth2Controller.validateAuthorizationCode()`](ref:oauth2) sends credentials with the HTTP basic auth scheme.

```ts
import { verifyState, AccessTokenRequestError } from "oslo/oauth2";

if (!verifyState(storedState, state)) {
	// error
}

// ...

try {
	const { accessToken, refreshToken } = await oauth2Controller.validateAuthorizationCode<{
		refreshToken: string;
	}>(code, {
		credentials: clientSecret,
		authenticateWith: "request_body"
	});
} catch (e) {
	if (e instanceof AccessTokenRequestError) {
		// see https://www.rfc-editor.org/rfc/rfc6749#section-5.2
		const { request, message, description } = e;
	}
	// unknown error
}
```

This also supports the PKCE flow:

```ts
await oauth2Controller.validateAuthorizationCode<{
	refreshToken: string;
}>(code, {
	credentials: clientSecret,
	codeVerifier
});
```
