---
type: "method"
---

# `TOTPController.verify()`

Verifies the TOTP.

## Definition

```ts
function verify(secretKey: ArrayBuffer, totp: string): Promise<boolean>;
```

### Parameters

- `secretKey`: HMAC secret key
- `totp`: TOTP
