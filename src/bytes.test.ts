import { test, expect } from "vitest";
import { bitsToInt, byteToBits, bytesToBits, compareBytes } from "./bytes.js";

test("bitsToInt()", () => {
	expect(bitsToInt("110100101000010101")).toBe(215573);
});

test("byteToBits()", () => {
	expect(byteToBits(101)).toBe("01100101");
});

test("bytesToBits()", () => {
	expect(bytesToBits(new Uint8Array([203, 3, 41, 76]))).toBe("11001011000000110010100101001100");
});

test("compareBytes()", () => {
	const randomBytes = new Uint8Array(32);
	crypto.getRandomValues(randomBytes);
	expect(compareBytes(randomBytes, randomBytes)).toBe(true);
	const anotherRandomBytes = new Uint8Array(32);
	crypto.getRandomValues(anotherRandomBytes);
	expect(compareBytes(randomBytes, anotherRandomBytes)).toBe(false);
});
