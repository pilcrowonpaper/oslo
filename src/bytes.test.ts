import { test, expect } from "vitest";
import {
	binaryToInteger,
	byteToBinary,
	bytesToBinary,
	bytesToInteger,
	compareBytes
} from "./bytes.js";

test("bitsToInt()", () => {
	expect(binaryToInteger("110100101000010101")).toBe(215573);
});

test("byteToBits()", () => {
	expect(byteToBinary(101)).toBe("01100101");
});

test("bytesToBits()", () => {
	expect(bytesToBinary(new Uint8Array([203, 3, 41, 76]))).toBe("11001011000000110010100101001100");
});

test("bytesToInteger()", () => {
	const bytes = Uint8Array.from([54, 204, 4, 128]);
	expect(bytesToInteger(bytes)).toBe(new DataView(bytes.buffer).getUint32(0));
});

test("compareBytes()", () => {
	const randomBytes = new Uint8Array(32);
	crypto.getRandomValues(randomBytes);
	expect(compareBytes(randomBytes, randomBytes)).toBe(true);
	const anotherRandomBytes = new Uint8Array(32);
	crypto.getRandomValues(anotherRandomBytes);
	expect(compareBytes(randomBytes, anotherRandomBytes)).toBe(false);
});
