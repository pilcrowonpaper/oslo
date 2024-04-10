export { ECDSA } from "./ecdsa.js";
export { HMAC } from "./hmac.js";
export { RSASSAPKCS1v1_5, RSASSAPSS } from "./rsa.js";
export { sha1, sha256, sha384, sha512 } from "./sha/index.js";
export { random, generateRandomInteger, generateRandomString, alphabet } from "./random.js";

export type { ECDSACurve } from "./ecdsa.js";

export interface KeyPair {
	publicKey: Uint8Array;
	privateKey: Uint8Array;
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.length; i++) {
		c |= a[i]! ^ b[i]!;
	}
	return c === 0;
}
