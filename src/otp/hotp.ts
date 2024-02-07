import { binaryToInteger, byteToBinary, bytesToBinary } from "../bytes.js";
import { HMAC } from "../crypto/hmac.js";

import type { TypedArray } from "../index.js";

export async function generateHOTP(
	key: ArrayBuffer | TypedArray,
	counter: number,
	digits: number = 6
): Promise<string> {
	if (digits > 8) {
		throw new TypeError("Digits must be 8 or smaller");
	}
	const counterBytes = intTo8Bytes(counter);
	const HS = await new HMAC("SHA-1").sign(key, counterBytes);
	const SBites = truncate(new Uint8Array(HS));
	const SNum = binaryToInteger(SBites);
	const D = SNum % 10 ** digits;
	return D.toString().padStart(digits, "0");
}

function truncate(data: Uint8Array): string {
	const offset = binaryToInteger(byteToBinary(data[data.byteLength - 1]!).slice(4));
	return bytesToBinary(data).slice(offset * 8 + 1, (offset + 4) * 8);
}

function intTo8Bytes(int: number): Uint8Array {
	const result = new Uint8Array(8);
	const bits = int.toString(2).padStart(8 * 8, "0");
	for (let i = 0; i < 8; i++) {
		result[i] = binaryToInteger(bits.slice(i * 8, (i + 1) * 8));
	}
	return result;
}
