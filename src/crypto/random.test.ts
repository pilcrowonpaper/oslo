import { expect, test } from "vitest";
import { alphabet } from "./random.js";

test("alphabet()", async () => {
	expect(alphabet("0-9", "a-z", "A-Z", "-", "_")).toBe(
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
	);
});
