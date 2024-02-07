import type { TypedArray } from "../index.js";

export class Base16 {
	public alphabet: string;

	private decodeMap = new Map<string, number>();

	constructor(alphabet: string) {
		if (alphabet.length !== 16) {
			throw new Error("Invalid alphabet");
		}
		this.alphabet = alphabet;
		for (let i = 0; i < alphabet.length; i++) {
			this.decodeMap.set(alphabet[i]!, i);
		}
	}

	public encode(data: Uint8Array): string {
		let result = "";
		for (let i = 0; i < data.length; i++) {
			const key1 = data[i]! >> 4;
			result += this.alphabet[key1];
			const key2 = data[i]! & 0x0f;
			result += this.alphabet[key2];
		}
		return result;
	}

	public decode(data: string): Uint8Array {
		const chunkCount = Math.ceil(data.length / 2);
		const result = new Uint8Array(chunkCount);
		for (let i = 0; i < chunkCount; i++) {
			let buffer = 0;

			const encoded1 = data[i * 2]!;
			const value1 = this.decodeMap.get(encoded1) ?? null;
			if (value1 === null) {
				throw new Error(`Invalid character: ${encoded1}`);
			}
			buffer += value1 << 4;

			const encoded2 = data[i * 2 + 1];
			if (encoded2 === undefined) {
				throw new Error("Invalid data");
			}
			const value2 = this.decodeMap.get(encoded2) ?? null;
			if (value2 === null) {
				throw new Error(`Invalid character: ${encoded1}`);
			}
			buffer += value2;

			result[i] = buffer;
		}
		return result;
	}
}

export const base16 = new Base16("0123456789ABCDEF");

/** @deprecated Use `base16.encode()` instead */
export function encodeHex(data: ArrayBuffer | TypedArray): string {
	return new Base16("0123456789abcdef").encode(new Uint8Array(data));
}

/** @deprecated Use `base16.decode()` instead */
export function decodeHex(data: string): Uint8Array {
	return new Base16("0123456789abcdef").decode(data);
}
