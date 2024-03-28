import { describe, expect, test } from "vitest";
import { base32 as base32Reference } from "@scure/base";
import { base32 } from "./base32.js";

describe("Base32.encode()", () => {
	test("Generates valid string", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			expect(base32.encode(data)).toBe(base32Reference.encode(data));
		}
	});
	test("Omits padding", () => {
		const data = crypto.getRandomValues(new Uint8Array(4));
		const result = base32.encode(data, {
			includePadding: false
		});
		const expected = base32.encode(data).replaceAll("=", "");
		expect(result).toBe(expected);
	});
});

describe("Base32.decode()", () => {
	test("Returns encoded data", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			const encoded = base32.encode(data);
			expect(base32.decode(encoded)).toStrictEqual(data);
		}
	});
	test("Throws if data is missing padding in strict mode", () => {
		const data = crypto.getRandomValues(new Uint8Array(4));
		const encoded = base32.encode(data, {
			includePadding: false
		});
		expect(() => base32.decode(encoded.replaceAll("=", ""))).toThrow();
	});
	test("Accepts encoded data with missing padding if not in strict mode", () => {
		const data = crypto.getRandomValues(new Uint8Array(4));
		const encoded = base32.encode(data, {
			includePadding: false
		});
		const result = base32.decode(encoded.replaceAll("=", ""), {
			strict: false
		});
		expect(result).toStrictEqual(data);
	});
});
