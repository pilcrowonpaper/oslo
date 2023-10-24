import { verifyRequestOrigin } from "./index.js";
import { describe, test, expect } from "vitest";

describe("verifyRequestOrigin()", () => {
	test("checks if origin and host matches", () => {
		expect(verifyRequestOrigin("https://example.com", "example.com")).toBe(true);
		expect(verifyRequestOrigin("https://example.com", "invalid.com")).toBe(false);
	});

	test("allows full urls for host", () => {
		expect(verifyRequestOrigin("https://example.com", "https://example.com")).toBe(true);
		expect(verifyRequestOrigin("https://example.com", "https://invalid.com")).toBe(false);
	});

	test("checks port", () => {
		expect(verifyRequestOrigin("https://example.com:1000", "example.com:1000")).toBe(true);
		expect(verifyRequestOrigin("https://example.com:1000", "example.com:2000")).toBe(false);
	});

	test("ignores base domain by default", () => {
		expect(verifyRequestOrigin("https://example.com", "foo.example.com")).toBe(false);
	});

	test("checks nested subdomains", () => {
		expect(
			verifyRequestOrigin("https://foo.bar.example.com", "example.com", {
				allowedSubdomains: ["foo.bar"]
			})
		).toBe(true);
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
		).toBe(true);
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
			verifyRequestOrigin("https://example.com", "example.com", {
				allowedSubdomains: "*"
			})
		).toBe(true);
	});

	test("options.allowBaseDomain", () => {
		expect(
			verifyRequestOrigin("https://example.com", "foo.example.com", {
				allowBaseDomain: true
			})
		).toBe(true);
	});
});
