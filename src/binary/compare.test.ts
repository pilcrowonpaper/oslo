import { expect, test } from "vitest";

import { compareBytes } from "./compare.js";

test("compareBytes()", () => {
	const randomBytes = new Uint8Array(32);
	crypto.getRandomValues(randomBytes);
	expect(compareBytes(randomBytes, randomBytes)).toBe(true);
	const anotherRandomBytes = new Uint8Array(32);
	crypto.getRandomValues(anotherRandomBytes);
	expect(compareBytes(randomBytes, anotherRandomBytes)).toBe(false);
	expect(compareBytes(new Uint8Array(0), new Uint8Array(1))).toBe(false);
});
