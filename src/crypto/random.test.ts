import { expect, test } from "vitest";
import { alphabet, random } from "./random.js";

test("alphabet()", async () => {
	console.log(random())
	expect(alphabet("0-9", "a-z", "A-Z", "-", "_")).toBe(
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
	);
});
