import { expect } from "vitest";
import { test } from "vitest";
import { generateHOTP } from "./hotp.js";
import { decodeBase32 } from "../encoding";

test("generateHOTP()", async () => {
	const encodedSecret =
		"MMDYOBXERENQPBN2IK6SHLG5BHSGSM3DX35CLJATI3XAXWVQOJGKBD4NEZRQ5NLMUP6443GAB34GK3I75PDTLEUHCY6RCNBAAB5BQHA";
	const secret = decodeBase32(encodedSecret);
	expect(generateHOTP(secret, 0)).resolves.toBe("173573");
	expect(generateHOTP(secret, 10)).resolves.toBe("110880");
	expect(generateHOTP(secret, 100)).resolves.toBe("020803");
	expect(generateHOTP(secret, 1000)).resolves.toBe("115716");
});
