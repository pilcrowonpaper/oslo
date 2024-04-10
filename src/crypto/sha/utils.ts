export function rotl32(n: number, x: number): number {
	return ((x << n) | (x >>> (32 - n))) >>> 0;
}

export function rotr32(n: number, x: number): number {
	return ((x << (32 - n)) | (x >>> n)) >>> 0;
}

export function rotr64(n: bigint, x: bigint): bigint {
	return (x << (64n - n)) | ((x >> n) & 0xffffffffffffffffn);
}

export function uint32BytesBigEndian(n: number): Uint8Array {
	const result = new Uint8Array(4);
	for (let i = 0; i < 4; i++) {
		result[i] = ((n >> ((7 - i) * 8)) & 0xff) >>> 0;
	}
	return result;
}

export function uint64BytesBigEndian(n: bigint): Uint8Array {
	const result = new Uint8Array(8);
	for (let i = 0; i < 8; i++) {
		result[i] = Number((n >> BigInt((7 - i) * 8)) & 0xffn);
	}
	return result;
}
