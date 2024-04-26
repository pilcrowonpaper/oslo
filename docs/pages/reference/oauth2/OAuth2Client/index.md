---
title: "OAuth2Client"
---

# `OAuth2Client`

Client for OAuth 2.0, as defined in [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749). See [`oslo/oauth2`](/reference/oauth2) for a full example.

Use with [`OAuth2TokenRevocationClient`](/reference/oauth2/OAuth2TokenRevocationClient) to revoke tokens.

## Constructor

```ts
function constructor(
	clientId: string,
	authorizeEndpoint: string,
	tokenEndpoint: string,
	options?: {
		redirectURI?: string;
		authenticateWith?: "http_basic_auth" | "request_body";
	}
): this;
```

### Parameters

- `clientId`
- `authorizeEndpoint`
- `tokenEndpoint`
- `options`
  - `redirectURI`
  - `authenticateWith` (default: `"http_basic_auth"`): How the credentials should be sent

## Methods

- [`createAuthorizationURL()`](/reference/oauth2/OAuth2Client/createAuthorizationURL)
- [`refreshAccessToken()`](/reference/oauth2/OAuth2Client/refreshAccessToken)
- [`validateAuthorizationCode()`](/reference/oauth2/OAuth2Client/validateAuthorizationCode)

## Properties

```ts
interface Properties {
	clientId: string;
	authorizeEndpoint: string;
	tokenEndpoint: string;
}
```

- `clientId`
- `authorizeEndpoint`
- `tokenEndpoint`
