---
type: "interface"
---

# `AssertionResponse`

Represents a WebAuthn assertion response.

```ts
interface  AssertionResponse {
	clientDataJSON: ArrayBuffer;
	authenticatorData: ArrayBuffer;
	signature: ArrayBuffer;
}
```

- `clientDataJSON`
- `authenticatorData`
- `signature`
