---
type: "method"
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
- `publicKey`: User's public key stored in the database
- `response`: Attestation response
- `challenge`: Challenge used for creating the signature

## Example

```ts
const webauthnController: WebAuthnController;

try {
	const response: AssertionResponse = {
		// all `ArrayBuffer` type
		clientDataJSON,
		authenticatorData,
		signature
	};
	await webauthnController.validateAssertionResponse(
		"ES256", // "RS256"
		publicKey, // `ArrayBuffer`
		response,
		challenge // `ArrayBuffer`
	);
} catch {
	// failed to validate
}
```
