import { verifyRequestOrigin } from "./index.js";
import { describe, test, expect } from "vitest";

describe("verifyRequestOrigin()", () => {
	test("checks if origin and host matches", () => {
		expect(verifyRequestOrigin("https://example.com", ["example.com"])).toBe(true);
		expect(verifyRequestOrigin("https://example.co.jp", ["example.co.jp"])).toBe(true);
		expect(verifyRequestOrigin("https://example.com", ["invalid.com"])).toBe(false);
	});

	test("allows full urls for host", () => {
		expect(verifyRequestOrigin("https://example.com", ["https://example.com"])).toBe(true);
		expect(verifyRequestOrigin("https://example.co.jp", ["https://example.co.jp"])).toBe(true);
		expect(verifyRequestOrigin("https://example.com", ["https://invalid.com"])).toBe(false);
	});

	test("checks port", () => {
		expect(verifyRequestOrigin("https://example.com:1000", ["example.com:1000"])).toBe(true);
		expect(verifyRequestOrigin("https://example.com:1000", ["example.com:2000"])).toBe(false);
	});

	test("IDN", () => {
		expect(verifyRequestOrigin("http://xn--zckzah.com", ["xn--zckzah.com"])).toBe(true);
		expect(verifyRequestOrigin("http://xn--zckzah.com", ["テスト.com"])).toBe(true);
	});
});
