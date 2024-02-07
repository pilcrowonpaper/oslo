---
title: "encodeBase64url()"
---

# `encodeBase64url()`

**Deprecated - Use [`base64url`](/reference/encoding/base64url) instead.**

Encodes data into base64 URL string. Use [`decodeBase64url()`](/reference/encoding/decodeBase64url) to decode base64 URL strings.

## Definition

```ts
function encodeBase64url(data: ArrayBuffer | TypedArray): string;
```

### Parameters

- `data`

## Example

```ts
import { encodeBase64url } from "oslo/encoding";

const data = new TextEncoder("hello, world");
const encoded = encodeBase64url(data);
```
