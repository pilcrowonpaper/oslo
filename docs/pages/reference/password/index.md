---
title: "oslo/password"
---

# `oslo/password`

**This module (and only this module) is NOT runtime agnostic and relies on Node-specific APIs.**

Provides utilities for hashing passwords and verifying hashes. Argon2id is recommended, and if it's not possible, scrypt is recommended.

## Classes

- [`Argon2id`](/reference/password/Argon2id)
- [`Bcrypt`](/reference/password/Bcrypt)
- [`Scrypt`](/reference/password/Scrypt)

## Interfaces

- [`PasswordHashingAlgorithm`](/reference/password/PasswordHashingAlgorithm)

## Next.js

In Next.js specifically, you must update your config to prevent dependencies from the getting bundled.

```ts
// next.config.ts
const config = {
	experimental: {
		serverComponentsExternalPackages: ["@node-rs/argon2", "@node-rs/bcrypt"]
	}
};
```
