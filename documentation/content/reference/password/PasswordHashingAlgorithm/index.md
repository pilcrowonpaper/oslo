---
type: "interface"
---

# `PasswordHashingAlgorithm`

A generic interface for utilities for hashing and verifying passwords.

```ts
interface PasswordHashingAlgorithm {
	hash(password: string): Promise<string>;
	verify(hash: string, password: string): Promise<boolean>;
}
```

## Methods

- [PasswordHashingAlgorithm.hash](ref:password)
- [PasswordHashingAlgorithm.verify](ref:password)

## Implemented by

- [Argon2id](ref:password)
- [Bcrypt](ref:password)
- [Scrypt](ref:password)
