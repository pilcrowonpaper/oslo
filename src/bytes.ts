export function byteToBits(byte: number): string {
	return byte.toString(2).padStart(8, "0");
}

export function bytesToBits(bytes: Uint8Array): string {
	return [...bytes].map((val) => byteToBits(val)).join("");
}

export function bitsToInt(bits: string): number {
	return parseInt(bits, 2);
}

export function compareBytes(
	buffer1: ArrayBuffer | Uint8Array,
	buffer2: ArrayBuffer | Uint8Array
): boolean {
	const bytes1 = new Uint8Array(buffer1);
	const bytes2 = new Uint8Array(buffer2);
	if (bytes1.byteLength !== bytes2.byteLength) return false;
	for (let i = 0; i < bytes1.byteLength; i++) {
		if (bytes1[i] !== bytes2[i]) return false;
	}
	return true;
}
