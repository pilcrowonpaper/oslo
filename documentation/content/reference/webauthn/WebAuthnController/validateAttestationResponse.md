---
type: "method"
---

# `WebAuthnController.validateAttestationResponse()`

Validates a WebAuthn attestation response, including the signature, but not the attestation certificate. Throws an error on invalid response.

## Definition

```ts
//$ AttestationResponse=ref:webauthn
function validateAttestationResponse(
	response: $$AttestationResponse,
	challenge: ArrayBuffer
): Promise<void>;
```

### Parameters

- `response`: Attestation response
- `challenge`: Challenge used for creating the signature

## Example

```ts
//$ AttestationResponse=ref:webauthn
//$ webAuthnController=/reference/webauthn/WebAuthnController
try {
	const response: $$AttestationResponse = {
		// all `ArrayBuffer` type (`Uint8Array`, `ArrayBuffer` etc)
		clientDataJSON,
		authenticatorData
	};
	await $$webAuthnController.validateAttestationResponse(response, challenge);
} catch {
	// failed to validate
}
```
