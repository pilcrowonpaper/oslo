import { bitsToInt, bytesToBits } from "../bytes.js";

export function encodeBase64(
	data: ArrayBuffer,
	options?: {
		padding?: boolean;
	}
): string {
	let result = btoa(String.fromCharCode(...new Uint8Array(data)));
	if (options?.padding === false) {
		result = result.replaceAll("=", "");
	}
	return result;
}

export function decodeBase64(data: string): Uint8Array {
	return Uint8Array.from(
		atob(data)
			.split("")
			.map((x) => x.charCodeAt(0))
	);
}

export function encodeBase64url(data: ArrayBuffer): string {
	return encodeBase64(data, {
		padding: false
	})
		.replaceAll("+", "-")
		.replaceAll("/", "_");
}

export function decodeBase64url(data: string): Uint8Array {
	return decodeBase64(data.replaceAll("-", "+").replaceAll("_", "/"));
}

export function encodeHex(data: ArrayBuffer): string {
	const buffer = new Uint8Array(data);
	let result = "";
	for (let i = 0; i < buffer.length; i++) {
		result += buffer[i]!.toString(16).padStart(2, "0");
	}
	return result;
}

export function decodeHex(data: string): Uint8Array {
	const result = new Uint8Array(data.length / 2);
	for (let i = 0; i < data.length / 2; i++) {
		result[i] = parseInt(data.slice(i * 2, i * 2 + 2), 16);
	}
	return result;
}

export function encodeBase32(
	data: ArrayBuffer,
	options?: {
		padding?: boolean;
	}
): string {
	const bits = bytesToBits(new Uint8Array(data));
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	let result = "";
	for (let i = 0; i < Math.ceil(bits.length / 5); i++) {
		const key = bitsToInt(bits.slice(i * 5, (i + 1) * 5).padEnd(5, "0"));
		const val = alphabet[key];
		result += val;
	}
	const padding = options?.padding ?? true;
	if (padding) {
		result = result.padEnd(8 * Math.ceil(result.length / 8), "=");
	}
	return result;
}

export function decodeBase32(data: string): Uint8Array {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	data = data.replaceAll("=", "");
	let bits = "";
	for (let i = 0; i < data.length; i++) {
		const key = alphabet.indexOf(data[i]!);
		if (key === -1) throw new Error("Invalid input");
		bits += key.toString(2).padStart(5, "0");
	}
	const result = new Uint8Array(bits.length / 8);
	for (let i = 0; i < bits.length / 8; i++) {
		result[i] = bitsToInt(bits.slice(i * 8, (i + 1) * 8).padStart(8, "0"));
	}
	return result;
}
