---
title: "AttestationResponse"
---

# `AttestationResponse`

Represents a WebAuthn attestation response.

## Definition

```ts
interface AttestationResponse {
	clientDataJSON: Uint8Array;
	authenticatorData: Uint8Array;
}
```

### Properties

- `clientDataJSON`
- `authenticatorData`
