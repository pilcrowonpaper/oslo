export { ECDSA } from "./ecdsa.js";
export { HMAC } from "./hmac.js";
export { RSASSAPKCS1v1_5, RSASSAPSS } from "./rsa.js";
export { sha1, sha256, sha384, sha512 } from "./sha.js";

export type { ECDSACurve } from "./ecdsa.js";
export type { SHAHash } from "./sha.js";

export interface KeyPair {
	publicKey: ArrayBuffer;
	privateKey: ArrayBuffer;
}

export function constantTimeEqual(a: ArrayBuffer, b: ArrayBuffer): boolean {
	const aBuffer = new Uint8Array(a);
	const bBuffer = new Uint8Array(b);
	if (aBuffer.length !== bBuffer.length) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < aBuffer.length; i++) {
		c |= aBuffer[i]! ^ bBuffer[i]!; // ^: XOR operator
	}
	return c === 0;
}
