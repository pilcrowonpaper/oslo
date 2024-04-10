import { base64url } from "../encoding/index.js";
import { compareBytes } from "../bytes.js";
import { ECDSA, RSASSAPKCS1v1_5, sha256 } from "../crypto/index.js";

export interface AttestationResponse {
	clientDataJSON: Uint8Array;
	authenticatorData: Uint8Array;
}

export interface AssertionResponse {
	clientDataJSON: Uint8Array;
	authenticatorData: Uint8Array;
	signature: Uint8Array;
}

export class WebAuthnController {
	private originURL: URL;
	constructor(origin: string) {
		this.originURL = new URL(origin);
	}

	public async validateAttestationResponse(
		response: AttestationResponse,
		challenge: Uint8Array
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
		publicKey: Uint8Array,
		response: AssertionResponse,
		challenge: Uint8Array
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
			const hash = sha256(response.clientDataJSON);
			const data = concatenateBytes(response.authenticatorData, hash);
			const es256 = new ECDSA("SHA-256", "P-256");
			const validSignature = await es256.verify(publicKey, signature, data);
			if (!validSignature) {
				throw new Error("Failed to validate signature");
			}
		} else if (algorithm === "RS256") {
			const signature = convertDERSignatureToECDSASignature(response.signature);
			const hash = sha256(response.clientDataJSON);
			const data = concatenateBytes(response.authenticatorData, hash);
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
		clientDataJSON: Uint8Array,
		challenge: Uint8Array
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

	private async verifyAuthenticatorData(authData: Uint8Array): Promise<boolean> {
		if (authData.byteLength < 37) {
			return false;
		}
		const rpIdHash = authData.slice(0, 32);
		const rpIdData = new TextEncoder().encode(this.originURL.hostname);
		const expectedRpIdHash = sha256(rpIdData);
		// compare buffer
		if (!compareBytes(rpIdHash, expectedRpIdHash)) {
			return false;
		}
		const flagsBits = authData[32].toString(2);
		if (flagsBits.charAt(flagsBits.length - 1) !== "1") {
			return false;
		}
		return true;
	}
}

function convertDERSignatureToECDSASignature(DERSignature: Uint8Array): Uint8Array {
	const rStart = 4;
	const rLength = DERSignature[3];
	const rEnd = rStart + rLength!;
	const DEREncodedR = DERSignature.slice(rStart, rEnd);
	// DER encoded 32 bytes integers can have leading 0x00s or be smaller than 32 bytes
	const r = decodeDERInteger(DEREncodedR, 32);

	const sStart = rEnd + 2;
	const sEnd = DERSignature.byteLength;
	const DEREncodedS = DERSignature.slice(sStart, sEnd);
	// repeat the process
	const s = decodeDERInteger(DEREncodedS, 32);

	const ECDSASignature = new Uint8Array([...r, ...s]);
	return ECDSASignature;
}

function decodeDERInteger(integerBytes: Uint8Array, expectedLength: number): Uint8Array {
	if (integerBytes.byteLength === expectedLength) return integerBytes;
	if (integerBytes.byteLength < expectedLength) {
		return concatenateBytes(
			// add leading 0x00s if smaller than expected length
			new Uint8Array(expectedLength - integerBytes.byteLength).fill(0),
			integerBytes
		);
	}
	// remove leading 0x00s if larger then expected length
	return integerBytes.slice(-32);
}

function concatenateBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
	const result = new Uint8Array(a.byteLength + b.byteLength);
	result.set(new Uint8Array(a), 0);
	result.set(new Uint8Array(b), a.byteLength);
	return result;
}
