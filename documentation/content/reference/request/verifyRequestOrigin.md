---
type: "function"
---

# `verifyRequestOrigin()`

Verifies the request originates from a trusted origin by comparing the `Origin` header and host (e.g. `Host` header). Returns `false` if either `origin` or `host` is undefined.

You can allow specific or all subdomains (with `"*"`) with `options.allowedSubdomains`. The base domain is the domain of the `host`, regardless of it already has a subdomain or not.

## Definition

```ts
function verifyRequestOrigin(
	origin: string | null | undefined,
	host: string | null | undefined,
	options?: {
		allowedSubdomains?: string[] | "*";
	}
): boolean;
```

### Parameters

- `origin`: `Origin` header
- `host`: `Host` header, [host](https://developer.mozilla.org/en-US/docs/Web/API/URL/host) of the server url, or the server URL
- `options`
  - `allowedSubdomains`: A list of subdomains to allow

## Example

```ts
import { verifyRequestOrigin } from "oslo/request";

// true
verifyRequestOrigin("https://example.com", "example.com");
verifyRequestOrigin("https://example.com", "https://example.com");
verifyRequestOrigin("https:/foo.example.com", "example.com", {
	allowedSubdomains: ["foo"]
});
verifyRequestOrigin("https:/foo.example.com", "example.com", {
	allowedSubdomains: "*"
});

// false
verifyRequestOrigin("https://foo.example.com", "example.com");
verifyRequestOrigin("https://example.com", "foo.example.com");
verifyRequestOrigin(null, null);
verifyRequestOrigin("https:/foo.example.com", "example.com", {
	allowedSubdomains: ["bar"]
});
verifyRequestOrigin("https:/bar.example.com", "foo.example.com", {
	allowedSubdomains: ["bar"] // checks for `bar.foo.example.com`
});
```
