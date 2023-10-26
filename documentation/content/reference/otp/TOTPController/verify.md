---
type: "method"
---

# `TOTPController.verify()`

Verifies the TOTP.

```ts
function verify(secretKey: ArrayBuffer, totp: string): Promise<boolean>
```

- `secretKey`: HMAC secret key
- `totp`: TOTP

