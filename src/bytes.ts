export function byteToBits(byte: number): string {
	return byte.toString(2).padStart(8, "0");
}

export function bytesToBits(bytes: Uint8Array): string {
	return [...bytes].map((val) => byteToBits(val)).join("");
}

export function bitsToInt(bits: string): number {
	return parseInt(bits, 2);
}
