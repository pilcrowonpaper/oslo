---
type: "class"
node: true
implements: "PasswordHashingAlgorithm"
implements_link: "ref:password"
---

# `Argon2id`

Provides methods for hashing passwords and verifying hashes with [argon2id](). By default, the configuration is set to [the recommended values](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

## Constructor

```ts
function constructor(options?: {
	memorySize?: number;
	iterations?: number;
	tagLength?: number;
	parallelism?: number;
	version?: number;
	secret?: Buffer;
}): this;
```

### Parameters

- `options`
  - `memorySize` (default: `19456`)
  - `iterations` (default: `2`)
  - `tagLength` (default: `32`)
  - `parallelism` (default: `1`)
  - `version`
  - `secret`

## Methods

- [`hash()`](ref:password/PasswordHashingAlgorithm)
- [`verify()`](ref:password/PasswordHashingAlgorithm)

## Example

```ts
import { Argon2id } from "oslo/password";

const argon2id = new Argon2id();
const hash = await argon2id.hash(password);
const validPassword = await argon2id.verify(hash, password);
```
