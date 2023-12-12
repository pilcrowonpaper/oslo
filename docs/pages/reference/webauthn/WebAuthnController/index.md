---
title: "WebAuthnController"
---

# `WebAuthnController`

Provides methods for validating WebAuthn attestation and assertion responses. Supports ES256 (algorithm id `-7`) and RS256 (algorithm id `-257`).

## Constructor

```ts
function constructor(origin: string): this;
```

### Parameters

- `origin`: Where the frontend is hosted (full url)

## Methods

- [`validateAssertionResponse()`](/reference/webauthn/WebAuthnController/validateAssertionResponse)
- [`validateAttestationResponse()`](/reference/webauthn/WebAuthnController/validateAttestationResponse)
