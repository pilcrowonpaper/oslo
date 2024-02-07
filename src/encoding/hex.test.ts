import { describe, expect, test } from "vitest";
import { encodeHex, decodeHex } from "./hex.js";

describe("encodeHex()", () => {
	test("Generates valid hex string", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			expect(encodeHex(data)).toBe(Buffer.from(data).toString("hex"));
		}
	});
});

describe("Base32.decode()", () => {
	test("Returns encoded data", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			const encoded = encodeHex(data);
			expect(decodeHex(encoded)).toStrictEqual(data);
			expect(decodeHex(encoded.toUpperCase())).toStrictEqual(data);
		}
	});
	test("Throws if data is invalid", () => {
		expect(() => decodeHex("a")).toThrow();
	});
});
