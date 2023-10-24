import { expect } from "vitest";
import { test } from "vitest";
import { base32 } from "@scure/base";
import {
	decodeBase32,
	decodeBase64,
	decodeBase64url,
	decodeHex,
	encodeBase32,
	encodeBase64,
	encodeBase64url,
	encodeHex
} from ".";

test("encodeBase64()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		expect(encodeBase64(randomValues)).toBe(Buffer.from(randomValues).toString("base64"));
	}
});

test("decodeBase64()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		expect(encodeBase64(randomValues)).toBe(Buffer.from(randomValues).toString("base64"));
	}
});

test("encodeBase64url()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		expect(encodeBase64url(randomValues)).toBe(Buffer.from(randomValues).toString("base64url"));
	}
});

test("encodeHex()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		expect(encodeHex(randomValues)).toBe(Buffer.from(randomValues).toString("hex"));
	}
});

test("encodeBase32()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		expect(encodeBase32(randomValues)).toBe(base32.encode(randomValues));
	}
});

test("decodeBase64()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		const encoded = encodeBase64(randomValues);
		expect(decodeBase64(encoded)).toEqual(randomValues);
	}
});

test("decodeBase64url()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		const encoded = encodeBase64url(randomValues);
		expect(decodeBase64url(encoded)).toEqual(randomValues);
	}
});

test("decodeHex()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		const encoded = encodeHex(randomValues);
		expect(decodeHex(encoded)).toEqual(randomValues);
	}
});

test("decodeBase32()", () => {
	for (let i = 0; i < 100; i++) {
		const randomValues = new Uint8Array(i);
		crypto.getRandomValues(randomValues);
		const encoded = encodeBase32(randomValues);
		expect(decodeBase32(encoded)).toEqual(randomValues);
	}
});
