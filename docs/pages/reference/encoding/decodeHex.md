---
title: "decodeHex()"
---

# `decodeHex()`

Decodes hex-encoded strings based on [RFC 4648 §8](https://datatracker.ietf.org/doc/html/rfc4648#section-8). Supports both lowercase and uppercase hex strings anf throws if the hex string is malformed. Use [`encodeHex()`](/reference/encoding/encodeHex) to encode into hex strings.

## Definition

```ts
function decodeHex(data: string): Uint8Array;
```

### Parameters

- `data`

## Example

```ts
import { decodeHex } from "oslo/encoding";

const data = decodeHex(encoded);
const text = new TextDecoder().decode(data);
```
