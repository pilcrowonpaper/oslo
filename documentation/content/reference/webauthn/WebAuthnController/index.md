---
type: "class"
---

# `WebAuthnController`

Provides methods for validating WebAuthn attestation and assertion responses. Supports ES256 (algorithm id `-7`) and RS256 (algorithm id `-257`).

## Constructor

```ts
function constructor(origin: string): this;
```

- `origin`: Where the frontend is hosted (full url)

## Methods

- [WebAuthnController.validateAssertionResponse()](ref:webauthn)
- [WebAuthnController.validateAttestationResponse()](ref:webauthn)
