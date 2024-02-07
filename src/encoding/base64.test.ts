import { describe, expect, test } from "vitest";
import { base64 } from "./base64.js";

describe("Base64.encode()", () => {
	test("Generates valid string", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			expect(base64.encode(data)).toBe(Buffer.from(data).toString("base64"));
		}
	});
	test("Omits padding", () => {
		const data = crypto.getRandomValues(new Uint8Array(4));
		const result = base64.encode(data, {
			includePadding: false
		});
		const expected = base64.encode(data).replaceAll("=", "");
		expect(result).toBe(expected);
	});
});

describe("Base64.decode()", () => {
	test("Returns encoded data", () => {
		const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		for (const length of cases) {
			const data = crypto.getRandomValues(new Uint8Array(length));
			const encoded = base64.encode(data);
			expect(base64.decode(encoded)).toStrictEqual(data);
		}
	});
	test("Throws if data is missing padding in strict mode", () => {
		const data = crypto.getRandomValues(new Uint8Array(4));
		const encoded = base64.encode(data, {
			includePadding: false
		});
		expect(() => base64.decode(encoded.replaceAll("=", ""))).toThrow();
	});
	test("Accepts encoded data with missing padding if not in strict mode", () => {
		const data = crypto.getRandomValues(new Uint8Array(4));
		const encoded = base64.encode(data, {
			includePadding: false
		});
		const result = base64.decode(encoded.replaceAll("=", ""), {
			strict: false
		});
		expect(result).toStrictEqual(data);
	});
});
