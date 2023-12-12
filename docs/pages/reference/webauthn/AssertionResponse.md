---
title: "AssertionResponse"
---

# `AssertionResponse`

Represents a WebAuthn assertion response.

## Definition

```ts
interface AssertionResponse {
	clientDataJSON: ArrayBuffer;
	authenticatorData: ArrayBuffer;
	signature: ArrayBuffer;
}
```

### Properties

- `clientDataJSON`
- `authenticatorData`
- `signature`
