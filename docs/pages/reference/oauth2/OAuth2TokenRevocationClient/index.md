---
title: "OAuth2TokenRevocationClient"
---

# `OAuth2TokenRevocationClient`

Client for OAuth 2.0 token revocation, as defined in [RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009).

## Constructor

```ts
function constructor(
	clientId: string,
	tokenRevocationEndpoint: string,
	options?: {
		authenticateWith?: "http_basic_auth" | "request_body";
	}
): this;
```

### Parameters

- `clientId`
- `tokenRevocationEndpoint`
- `options`
  - `authenticateWith` (default: `"http_basic_auth"`): How the credentials should be sent

## Methods

- [`revokeAccessToken()`](/reference/oauth2/OAuth2TokenRevocationClient/revokeAccessToken)
- [`revokeRefreshToken()`](/reference/oauth2/OAuth2TokenRevocationClient/revokeRefreshToken)

## Properties

```ts
interface Properties {
	clientId: string;
	tokenRevocationEndpoint: string;
}
```

- `clientId`
- `tokenRevocationEndpoint`
