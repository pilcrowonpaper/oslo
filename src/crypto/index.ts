export { ECDSA } from "./ecdsa.js";
export { HMAC } from "./hmac.js";
export { RSASSAPKCS1v1_5, RSASSAPSS } from "./rsa.js";
export { sha1, sha256, sha384, sha512 } from "./sha.js";
export { random, generateRandomInteger, generateRandomString, alphabet } from "./random.js";
export { constantTimeEqual } from "./buffer.js";

export type { ECDSACurve } from "./ecdsa.js";
export type { SHAHash } from "./sha.js";

import type { TypedArray } from "../index.js";

export interface KeyPair {
	publicKey: ArrayBuffer | TypedArray;
	privateKey: ArrayBuffer | TypedArray;
}
