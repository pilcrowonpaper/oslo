import { bitsToInt, byteToBits } from "../bytes.js";

export async function generateHOTP(
	secret: string | ArrayBufferLike,
	counter: number,
	digits = 6
): Promise<string> {
	if (digits > 8) {
		throw new TypeError("Digits must be 8 or smaller");
	}
	const secretBytes =
		typeof secret === "string"
			? new TextEncoder().encode(secret)
			: new Uint8Array(secret);
	const counterBytes = intTo8Bytes(counter);
	const key = await crypto.subtle.importKey(
		"raw",
		secretBytes,
		{
			name: "HMAC",
			hash: "SHA-1"
		},
		false,
		["sign"]
	);
	const HS = await crypto.subtle.sign("HMAC", key, counterBytes);
	const SBites = truncate(new Uint8Array(HS));
	const SNum = bitsToInt(SBites);
	const D = SNum % 10 ** digits;
	return D.toString().padStart(digits, "0");
}

function truncate(data: Uint8Array): string {
	const offset = bitsToInt(byteToBits(data[19]!).slice(4));
	const p = data.slice(offset, offset + 3 + 1);
	return [...p]
		.map((val) => byteToBits(val))
		.join("")
		.slice(1);
}

function intTo8Bytes(int: number): Uint8Array {
	const result = new Uint8Array(8);
	const bits = int.toString(2).padStart(8 * 8, "0");
	for (let i = 0; i < 8; i++) {
		result[i] = bitsToInt(bits.slice(i * 8, (i + 1) * 8));
	}
	return result;
}
