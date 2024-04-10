---
title: "AssertionResponse"
---

# `AssertionResponse`

Represents a WebAuthn assertion response.

## Definition

```ts
interface AssertionResponse {
	clientDataJSON: Uint8Array;
	authenticatorData: Uint8Array;
	signature: Uint8Array;
}
```

### Properties

- `clientDataJSON`
- `authenticatorData`
- `signature`
