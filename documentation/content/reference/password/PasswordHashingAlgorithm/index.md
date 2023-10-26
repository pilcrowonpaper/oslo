---
type: "interface"
---

# `PasswordHashingAlgorithm`

A generic interface for utilities for hashing and verifying passwords.

## Definition

```ts
interface PasswordHashingAlgorithm {
	hash(password: string): Promise<string>;
	verify(hash: string, password: string): Promise<boolean>;
}
```

### Methods

- [`hash()`](ref:password/PasswordHashingAlgorithm)
- [`verify()`](ref:password/PasswordHashingAlgorithm)

## Implemented by

- [Argon2id](ref:password)
- [Bcrypt](ref:password)
- [Scrypt](ref:password)
