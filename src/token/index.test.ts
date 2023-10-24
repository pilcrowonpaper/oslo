import { test, describe, expect } from "vitest";
import { TimeSpan } from "../index.js";
import { VerificationTokenController } from "./index.js";

describe("SessionController", () => {
	const verificationTokenController = new VerificationTokenController(new TimeSpan(1, "h"));
	test("verificationTokenController.isTokenReusable()", () => {
		expect(
			verificationTokenController.isTokenReusable(
				new Date(Date.now() + new TimeSpan(40, "m").milliseconds())
			)
		).toBe(true);
		expect(
			verificationTokenController.isTokenReusable(
				new Date(Date.now() + new TimeSpan(20, "m").milliseconds())
			)
		).toBe(false);
	});
});
