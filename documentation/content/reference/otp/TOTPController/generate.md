---
type: "method"
---

# `TOTPController.generate()`

Generates a new TOTP.

## Definition

```ts
function generate(secretKey: ArrayBuffer): Promise<string>;
```

### Parameters

- `secretKey`: HMAC SHA-1 secret key
