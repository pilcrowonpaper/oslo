---
title: "OAuth2Client"
---

# `OAuth2Client`

Helper for OAuth 2.0, as defined in [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749). See [`oslo/oauth2`](/reference/oauth2) for a full example.

## Constructor

```ts
function constructor(
	clientId: string,
	authorizeEndpoint: string,
	tokenEndpoint: string,
	options?: {
		redirectURI?: string;
	}
): this;
```

### Parameters

- `clientId`
- `authorizeEndpoint`
- `tokenEndpoint`
- `options`
  - `redirectURI`

## Methods

- [`createAuthorizationURL()`](/reference/oauth2/OAuth2Client/createAuthorizationURL)
- [`refreshAccessToken()`](/reference/oauth2/OAuth2Client/refreshAccessToken)
- [`validateAuthorizationCode()`](/reference/oauth2/OAuth2Client/validateAuthorizationCode)

## Properties

```ts
interface Properties {
	clientId: string;
}
```

- `clientId`
