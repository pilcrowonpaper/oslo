---
title: "oslo/password"
---

# `oslo/password`

**This module (and only this module) is NOT runtime agnostic and relies on Node-specific APIs.**

Provides utilities for hashing passwords and verifying hashes. Argon2id is recommended, and if it's not possible, scrypt is recommended.

## Classes

- [`Argon2id`](ref:password)
- [`Bcrypt`](ref:password)
- [`Scrypt`](ref:password)

## Interfaces

- [`PasswordHashingAlgorithm`](ref:password)
