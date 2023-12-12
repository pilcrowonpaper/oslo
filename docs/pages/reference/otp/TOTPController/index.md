---
title: "TOTPController"
---

# `TOTPController`

Helper for Time-based OTP, as defined in [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238). Only supports HMAC SHA-1.

## Constructor

```ts
function constructor(options?: { digits?: number; period?: TimeSpan }): this;
```

### Parameters

- `options`
  - `digits` (default: `6`): Number of digits (usually 6~8)
  - `period` (default: `30s`): How long the OTP is valid for at max

## Methods

- [`generate()`](ref:otp/TOTPController)
- [`verify()`](ref:otp/TOTPController)

## Example

The secret key should be for HMAC SHA-1.

```ts
import { TOTPController } from "oslo/otp";
import { TimeSpan } from "oslo";
import { HMAC } from "oslo/crypto";

const totpController = new TOTPController();

const secret = await new HMAC("SHA-1").generateKey();

const otp = await totpController.generate(secret);
const validOTP = await totpController.verify(otp, secret);
```
