---
type: "method"
---

# `TOTPController.generate()`

Generates a new TOTP.

```ts
function generate(secretKey: ArrayBuffer): Promise<string>
```

- `secretKey`: HMAC SHA-1 secret key

