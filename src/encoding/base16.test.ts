import { expect } from "vitest";
import { test } from "vitest";
import { base16 } from "./base16.js";
import { describe } from "node:test";

describe("Base32.encode()", () => {
	test("Generates valid string", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			expect(base16.encode(data)).toBe(Buffer.from(data).toString("hex").toUpperCase());
		}
	});
});

describe("Base32.decode()", () => {
	test("Returns encoded data", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			const encoded = base16.encode(data);
			expect(base16.decode(encoded)).toStrictEqual(data);
		}
	});
	test("Throws if data is invalid", () => {
		expect(() => base16.decode("A")).toThrow();
	});
});
