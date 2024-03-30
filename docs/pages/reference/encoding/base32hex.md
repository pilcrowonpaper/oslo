---
title: "base32hex"
---

# `base32hex`

Implements Base 32 with extended hex alphabet based on [RFC 4648 §7](https://datatracker.ietf.org/doc/html/rfc4648#section-7) with [`Base32Encoding`](/reference/encoding/Base32Encoding).

```ts
import { base32hex } from "oslo/encoding";

const encoded = base32hex.encode(message);
const decoded = base32hex.decode(encoded);
```
