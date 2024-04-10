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

export function compareBytes(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) return false;
	for (let i = 0; i < b.byteLength; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
