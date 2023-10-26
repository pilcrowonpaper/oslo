---
type: "function"
---

# `createTOTPKeyURI()`

Creates a new [key URI]() for TOTP. Only supports HMAC SHA-1.

## Definition

```ts
function createTOTPKeyURI(
	issuer: string,
	accountName: string,
	secret: ArrayBuffer,
	options?: {
		digits?: number;
		period?: TimeSpan;
	}
): string;
```

### Parameters

- `issuer`: Your company/website name
- `accountName`: Account identifier (e.g. username)
- `secret`: HOTP secret key
- `options`
  - `digits` (default: `6`): OTP digits
  - `period` (default: `30s`): How long the OTP is valid for at max

## Example

```ts
import { createTOTPKeyURI } from "oslo/otp";
import { HMAC } from "oslo/crypto";

const secret = await new HMAC("SHA-1").generateKey();

const issuer = "My website";
const accountName = "user@example.com";

const uri = createTOTPKeyURI(issuer, accountName, secret);
```
