---
title: "Argon2id.hash()"
---

# `Argon2id.hash()`

Hashes the provided password with argon2id.

## Definition

```ts
function hash(password: string): Promise<string>;
```

### Parameters

- `password`

## Example

```ts
//$ argon2id=/reference/password/Argon2id
const hash = await $$argon2id.hash(password);
```
