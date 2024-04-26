export function compareBytes(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) return false;
	for (let i = 0; i < b.byteLength; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
