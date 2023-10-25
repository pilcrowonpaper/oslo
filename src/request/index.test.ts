import { verifyRequestOrigin } from "./index.js";
import { describe, test, expect } from "vitest";

describe("verifyRequestOrigin()", () => {
	test("checks if origin and host matches", () => {
		expect(verifyRequestOrigin("https://example.com", "example.com")).toBe(true);
		expect(verifyRequestOrigin("https://example.co.jp", "example.co.jp")).toBe(true);
		expect(verifyRequestOrigin("https://example.com", "invalid.com")).toBe(false);
	});

	test("allows full urls for host", () => {
		expect(verifyRequestOrigin("https://example.com", "https://example.com")).toBe(true);
		expect(verifyRequestOrigin("https://example.co.jp", "https://example.co.jp")).toBe(true);
		expect(verifyRequestOrigin("https://example.com", "https://invalid.com")).toBe(false);
	});

	test("checks port", () => {
		expect(verifyRequestOrigin("https://example.com:1000", "example.com:1000")).toBe(true);
		expect(verifyRequestOrigin("https://example.com:1000", "example.com:2000")).toBe(false);
	});

	test("IDN", () => {
		expect(verifyRequestOrigin("http://xn--zckzah", "xn--zckzah")).toBe(true);
		expect(verifyRequestOrigin("http://xn--zckzah", "テスト")).toBe(true);
		expect(
			verifyRequestOrigin("http://foo.xn--zckzah", "テスト", {
				allowedSubdomains: ["foo"]
			})
		).toBe(true);
	});

	test("ignores base domain by default", () => {
		expect(verifyRequestOrigin("https://example.com", "foo.example.com")).toBe(false);
	});

	test("accepts null and undefined", () => {
		expect(verifyRequestOrigin(null, null)).toBe(false);
		expect(verifyRequestOrigin(undefined, undefined)).toBe(false);
	});

	test("options.allowedSubdomains", () => {
		expect(
			verifyRequestOrigin("https://foo.example.com", "example.com", {
				allowedSubdomains: ["foo"]
			})
		).toBe(true);
		expect(
			verifyRequestOrigin("https://foo.example.com", "bar.example.com", {
				allowedSubdomains: ["foo"]
			})
		).toBe(false);
		expect(
			verifyRequestOrigin("https://bar.example.com", "example.com", {
				allowedSubdomains: ["foo"]
			})
		).toBe(false);
		expect(
			verifyRequestOrigin("https://foo.example.com", "example.com", {
				allowedSubdomains: "*"
			})
		).toBe(true);
		expect(
			verifyRequestOrigin("https://foo.example.com", "bar.example.com", {
				allowedSubdomains: "*"
			})
		).toBe(false);
		expect(
			verifyRequestOrigin("https://example.com", "example.com", {
				allowedSubdomains: "*"
			})
		).toBe(true);
		expect(
			verifyRequestOrigin("https://foo.bar.example.com", "example.com", {
				allowedSubdomains: ["foo.bar"]
			})
		).toBe(true);
	});
});
