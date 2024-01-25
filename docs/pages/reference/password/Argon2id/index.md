---
title: "Argon2id"
---

# `Argon2id`

Provides methods for hashing passwords and verifying hashes with [argon2id](https://datatracker.ietf.org/doc/rfc9106/). By default, the configuration is set to [the recommended values](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

Implements [`PasswordHashingAlgorithm`](/reference/password/PasswordHashingAlgorithm).

## Constructor

```ts
function constructor(options?: {
	memorySize?: number;
	iterations?: number;
	tagLength?: number;
	parallelism?: number;
	secret?: ArrayBuffer | TypedArray;
}): this;
```

### Parameters

- `options`
  - `memorySize` (default: `19456`)
  - `iterations` (default: `2`)
  - `tagLength` (default: `32`)
  - `parallelism` (default: `1`)
  - `secret`

## Methods

- [`hash()`](/reference/password/Argon2id/hash)
- [`verify()`](/reference/password/Argon2id/verify)

## Example

```ts
import { Argon2id } from "oslo/password";

const argon2id = new Argon2id();
const hash = await argon2id.hash(password);
const validPassword = await argon2id.verify(hash, password);
```
