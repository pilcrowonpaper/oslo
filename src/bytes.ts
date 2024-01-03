import type { TypedArray } from "./index.js";

export function byteToBinary(byte: number): string {
	return byte.toString(2).padStart(8, "0");
}

export function bytesToBinary(bytes: Uint8Array): string {
	return [...bytes].map((val) => byteToBinary(val)).join("");
}

export function binaryToInteger(bits: string): number {
	return parseInt(bits, 2);
}

export function bytesToInteger(bytes: Uint8Array): number {
	return parseInt(bytesToBinary(bytes), 2);
}

export function compareBytes(
	buffer1: ArrayBuffer | TypedArray,
	buffer2: ArrayBuffer | TypedArray
): boolean {
	const bytes1 = new Uint8Array(buffer1);
	const bytes2 = new Uint8Array(buffer2);
	if (bytes1.byteLength !== bytes2.byteLength) return false;
	for (let i = 0; i < bytes1.byteLength; i++) {
		if (bytes1[i] !== bytes2[i]) return false;
	}
	return true;
}
