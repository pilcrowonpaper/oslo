---
type: "method"
---

# `Scrypt.hash()`

Hashes the provided password with scrypt.

## Definition

```ts
function hash(password: string): Promise<string>;
```

### Parameters

- `password`

## Example

```ts
//$ argon2id=/reference/password/scrypt
const hash = await $$scrypt.hash(password);
```
