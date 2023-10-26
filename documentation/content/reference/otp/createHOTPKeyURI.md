---
type: "function"
---

# `createHOTPKeyURI()`

Creates a new [key URI]() for HOTP.

```ts
function createHOTPKeyURI(
	issuer: string,
	accountName: string,
	secret: ArrayBuffer,
	options?: {
		counter?: number;
		digits?: number;
	}
): string;
```

- `issuer`: Your company/website name
- `accountName`: Account identifier (e.g. username)
- `secret`: HOTP secret key
- `options`
  - `counter` (default: `0`): Counter count
  - `digits` (default: `6`): OTP digits

## Example

```ts
import { createHOTPKeyURI } from "oslo/otp";
import { HMAC } from "oslo/crypto";

const secret = await new HMAC("SHA-1").generateKey();

const issuer = "My website";
const accountName = "user@example.com";

const uri = createHOTPKeyURI(issuer, accountName, secret);
```
