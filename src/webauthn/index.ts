import { base64url } from "../encoding/index.js";
import { compareBytes } from "../bytes.js";
import { ECDSA, RSASSAPKCS1v1_5 } from "../crypto/index.js";

import type { TypedArray } from "../index.js";

export interface AttestationResponse {
	clientDataJSON: ArrayBuffer | TypedArray;
	authenticatorData: ArrayBuffer | TypedArray;
}

export interface AssertionResponse {
	clientDataJSON: ArrayBuffer | TypedArray;
	authenticatorData: ArrayBuffer | TypedArray;
	signature: ArrayBuffer | TypedArray;
}

export class WebAuthnController {
	private originURL: URL;
	constructor(origin: string) {
		this.originURL = new URL(origin);
	}

	public async validateAttestationResponse(
		response: AttestationResponse,
		challenge: ArrayBuffer | TypedArray
	): Promise<void> {
		const validClientDataJSON = this.verifyClientDataJSON(
			"webauthn.create",
			response.clientDataJSON,
			challenge
		);
		if (!validClientDataJSON) {
			throw new Error("Failed to validate client data JSON");
		}

		const validAuthenticatorData = await this.verifyAuthenticatorData(response.authenticatorData);
		if (!validAuthenticatorData) {
			throw new Error("Failed to validate authenticator data");
		}
	}

	public async validateAssertionResponse(
		algorithm: "ES256" | "RS256",
		publicKey: ArrayBuffer | TypedArray,
		response: AssertionResponse,
		challenge: ArrayBuffer | TypedArray
	): Promise<void> {
		const validClientDataJSON = this.verifyClientDataJSON(
			"webauthn.get",
			response.clientDataJSON,
			challenge
		);
		if (!validClientDataJSON) {
			throw new Error("Failed to validate client data JSON");
		}

		const validAuthenticatorData = await this.verifyAuthenticatorData(response.authenticatorData);
		if (!validAuthenticatorData) {
			throw new Error("Failed to validate authenticator data");
		}

		if (algorithm === "ES256") {
			const signature = convertDERSignatureToECDSASignature(response.signature);
			const hash = await crypto.subtle.digest("SHA-256", response.clientDataJSON);
			const data = concatenateBuffer(response.authenticatorData, hash);
			const es256 = new ECDSA("SHA-256", "P-256");
			const validSignature = await es256.verify(publicKey, signature, data);
			if (!validSignature) {
				throw new Error("Failed to validate signature");
			}
		} else if (algorithm === "RS256") {
			const signature = convertDERSignatureToECDSASignature(response.signature);
			const hash = await crypto.subtle.digest("SHA-256", response.clientDataJSON);
			const data = concatenateBuffer(response.authenticatorData, hash);
			const rs256 = new RSASSAPKCS1v1_5("SHA-256");
			const validSignature = await rs256.verify(publicKey, signature, data);
			if (!validSignature) {
				throw new Error("Failed to validate signature");
			}
		} else {
			throw new TypeError(`Unknown algorithm: ${algorithm}`);
		}
	}

	private verifyClientDataJSON(
		type: "webauthn.create" | "webauthn.get",
		clientDataJSON: ArrayBuffer | TypedArray,
		challenge: ArrayBuffer | TypedArray
	): boolean {
		const clientData: unknown = JSON.parse(new TextDecoder().decode(clientDataJSON));
		if (!clientData || typeof clientData !== "object") {
			return false;
		}
		if (!("type" in clientData) || clientData.type !== type) {
			return false;
		}
		if (!("challenge" in clientData) || typeof clientData.challenge !== "string") {
			return false;
		}
		const clientDataChallengeBuffer = base64url.decode(clientData.challenge, {
			strict: false
		});
		if (!compareBytes(clientDataChallengeBuffer, challenge)) {
			return false;
		}
		if (!("origin" in clientData) || clientData.origin !== this.originURL.origin) {
			return false;
		}
		return true;
	}

	private async verifyAuthenticatorData(authenticatorData: ArrayBuffer): Promise<boolean> {
		const authData = new Uint8Array(authenticatorData);
		if (authData.byteLength < 37) {
			return false;
		}
		const rpIdHash = authData.slice(0, 32);
		const rpIdData = new TextEncoder().encode(this.originURL.hostname);
		const expectedRpIdHash = await crypto.subtle.digest("SHA-256", rpIdData);
		// compare buffer
		if (!compareBytes(rpIdHash, expectedRpIdHash)) {
			return false;
		}
		const flagsBits = authData[32]!.toString(2);
		if (flagsBits.charAt(flagsBits.length - 1) !== "1") {
			return false;
		}
		return true;
	}
}

function convertDERSignatureToECDSASignature(DERSignature: ArrayBuffer): ArrayBuffer {
	const signatureBytes = new Uint8Array(DERSignature);

	const rStart = 4;
	const rLength = signatureBytes[3];
	const rEnd = rStart + rLength!;
	const DEREncodedR = signatureBytes.slice(rStart, rEnd);
	// DER encoded 32 bytes integers can have leading 0x00s or be smaller than 32 bytes
	const r = decodeDERInteger(DEREncodedR, 32);

	const sStart = rEnd + 2;
	const sEnd = signatureBytes.byteLength;
	const DEREncodedS = signatureBytes.slice(sStart, sEnd);
	// repeat the process
	const s = decodeDERInteger(DEREncodedS, 32);

	const ECDSASignature = new Uint8Array([...r, ...s]);
	return ECDSASignature.buffer;
}

function decodeDERInteger(integerBytes: Uint8Array, expectedLength: number): Uint8Array {
	if (integerBytes.byteLength === expectedLength) return integerBytes;
	if (integerBytes.byteLength < expectedLength) {
		return concatenateUint8Array(
			// add leading 0x00s if smaller than expected length
			new Uint8Array(expectedLength - integerBytes.byteLength).fill(0),
			integerBytes
		);
	}
	// remove leading 0x00s if larger then expected length
	return integerBytes.slice(-32);
}

function concatenateBuffer(
	buffer1: ArrayBuffer | TypedArray,
	buffer2: ArrayBuffer | TypedArray
): ArrayBuffer {
	return concatenateUint8Array(new Uint8Array(buffer1), new Uint8Array(buffer2)).buffer;
}

function concatenateUint8Array(bytes1: Uint8Array, bytes2: Uint8Array): Uint8Array {
	const result = new Uint8Array(bytes1.byteLength + bytes2.byteLength);
	result.set(new Uint8Array(bytes1), 0);
	result.set(new Uint8Array(bytes2), bytes1.byteLength);
	return result;
}
