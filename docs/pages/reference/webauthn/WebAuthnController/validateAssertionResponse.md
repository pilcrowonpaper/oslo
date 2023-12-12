---
title: "WebAuthnController.validateAssertionResponse()"
---

# `WebAuthnController.validateAssertionResponse()`

Validates a WebAuthn assertion response, including the signature. Supports ES256 (algorithm id `-7`) and RS256 (algorithm id `-257`). Throws an error on invalid response.

## Definition

```ts
//$ AssertionResponse=ref:webauthn
function validateAssertionResponse(
	algorithm: "ES256" | "RS256",
	publicKey: ArrayBuffer,
	response: $$AssertionResponse,
	challenge: ArrayBuffer
): Promise<void>;
```

### Parameters

- `algorithm`: Algorithm used for creating the signature
- `publicKey`: Users's public key stored in the database
- `response`: Attestation response
- `challenge`: Challenge used for creating the signature

## Example

```ts
//$ AssertionResponse=ref:webauthn
//$ webAuthnController=/reference/webauthn/WebAuthnController
try {
	const response: $$AssertionResponse = {
		clientDataJSON,
		authenticatorData,
		signature
	};
	await $$webAuthnController.validateAssertionResponse("ES256", publicKey, response, challenge);
} catch {
	// failed to validate
}
```
