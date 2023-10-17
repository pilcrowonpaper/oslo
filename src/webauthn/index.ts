import { encodeBase64Url } from "../encoding/index.js";
import { compareBytes } from "../bytes.js";

export interface WebAuthnAttestationResponse {
	clientDataJSON: ArrayBufferLike;
	authenticatorData: ArrayBufferLike;
}

export async function validateWebAuthnAttestationResponse(options: {
	response: WebAuthnAttestationResponse;
	challenge: ArrayBufferLike;
	origin: string;
}): Promise<void> {
	const originURL = new URL(options.origin);
	const clientDataJSON = new TextDecoder().decode(
		options.response.clientDataJSON
	);
	const clientData: unknown = JSON.parse(clientDataJSON);
	if (!clientData || typeof clientData !== "object") {
		throw new Error("Failed to parse JSON");
	}
	if (!("type" in clientData) || clientData.type !== "webauthn.create") {
		throw new Error("Failed to verify 'clientData.type'");
	}
	if (
		!("challenge" in clientData) ||
		clientData.challenge !== encodeBase64Url(options.challenge)
	) {
		throw new Error("Failed to verify 'clientData.challenge'");
	}
	if (!("origin" in clientData) || clientData.origin !== originURL.origin) {
		throw new Error("Failed to verify 'clientData.origin");
	}

	const authData = new Uint8Array(options.response.authenticatorData);
	if (authData.byteLength < 37) {
		throw new Error("Malformed 'authData'");
	}
	const rpIdHash = authData.slice(0, 32);
	const rpIdData = new TextEncoder().encode(originURL.hostname);
	const expectedRpIdHash = await crypto.subtle.digest("SHA-256", rpIdData);
	// compare buffer
	if (!compareBytes(rpIdHash, expectedRpIdHash)) {
		throw new Error("Failed to verify 'rpId' hash");
	}
	const flagsBits = authData[32]!.toString(2);
	if (flagsBits.charAt(flagsBits.length - 1) !== "1") {
		throw new Error("Failed to verify user present flag");
	}
}

export interface WebAuthnAssertionResponse {
	clientDataJSON: ArrayBufferLike;
	authenticatorData: ArrayBufferLike;
	signature: ArrayBufferLike;
}

export async function validateWebAuthnAssertionResponse(options: {
	response: WebAuthnAssertionResponse;
	publicKey: ArrayBufferLike;
	challenge: ArrayBufferLike;
	origin: string;
	algorithm: "ES256K";
}): Promise<void> {
	const originURL = new URL(options.origin);
	const clientDataJSON = new TextDecoder().decode(
		options.response.clientDataJSON
	);
	const clientData: unknown = JSON.parse(clientDataJSON);
	if (!clientData || typeof clientData !== "object") {
		throw new Error("Failed to parse JSON");
	}
	if (!("type" in clientData) || clientData.type !== "webauthn.get") {
		throw new Error("Failed to verify 'clientData.type'");
	}
	if (
		!("challenge" in clientData) ||
		clientData.challenge !== encodeBase64Url(options.challenge)
	) {
		throw new Error("Failed to verify 'clientData.challenge'");
	}
	if (!("origin" in clientData) || clientData.origin !== originURL.origin) {
		throw new Error("Failed to verify 'clientData.origin");
	}

	const authData = new Uint8Array(options.response.authenticatorData);
	if (authData.byteLength < 37) {
		throw new Error("Malformed 'authData'");
	}
	const rpIdHash = authData.slice(0, 32);
	const rpIdData = new TextEncoder().encode(originURL.hostname);
	const expectedRpIdHash = await crypto.subtle.digest("SHA-256", rpIdData);
	// compare buffer
	if (!compareBytes(rpIdHash, expectedRpIdHash)) {
		throw new Error("Failed to verify 'rpId' hash");
	}
	const flagsBits = authData[32]!.toString(2);
	if (flagsBits.charAt(flagsBits.length - 1) !== "1") {
		throw new Error("Failed to verify user present flag");
	}

	// the signature is encoded in DER
	// so we need to convert into ECDSA compatible format
	const signature = convertDERSignatureToECDSASignature(
		options.response.signature
	);
	const hash = await crypto.subtle.digest(
		"SHA-256",
		options.response.clientDataJSON
	);
	const data = concatenateBuffer(authData, hash);
	const key = await crypto.subtle.importKey(
		"spki",
		options.publicKey,
		{
			name: "ECDSA",
			namedCurve: "P-256"
		},
		true,
		["verify"]
	);
	const validSignature = await crypto.subtle.verify(
		{
			name: "ECDSA",
			hash: "SHA-256"
		},
		key,
		signature,
		data
	);
	if (!validSignature) {
		throw new Error("Invalid signature");
	}
}

function convertDERSignatureToECDSASignature(
	DERSignature: ArrayBufferLike
): ArrayBuffer {
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

function decodeDERInteger(
	integerBytes: Uint8Array,
	expectedLength: number
): Uint8Array {
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
	buffer1: ArrayBuffer,
	buffer2: ArrayBuffer
): ArrayBuffer {
	return concatenateUint8Array(new Uint8Array(buffer1), new Uint8Array(buffer2))
		.buffer;
}

function concatenateUint8Array(
	bytes1: Uint8Array,
	bytes2: Uint8Array
): Uint8Array {
	const result = new Uint8Array(bytes1.byteLength + bytes2.byteLength);
	result.set(new Uint8Array(bytes1), 0);
	result.set(new Uint8Array(bytes2), bytes1.byteLength);
	return result;
}
