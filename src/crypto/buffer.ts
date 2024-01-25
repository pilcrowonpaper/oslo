import type { TypedArray } from "../index.js";

export function constantTimeEqual(
	a: ArrayBuffer | TypedArray,
	b: ArrayBuffer | TypedArray
): boolean {
	const aBuffer = new Uint8Array(a);
	const bBuffer = new Uint8Array(b);
	if (aBuffer.length !== bBuffer.length) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < aBuffer.length; i++) {
		c |= aBuffer[i]! ^ bBuffer[i]!; // ^: XOR operator
	}
	return c === 0;
}
