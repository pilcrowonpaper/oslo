import { test, describe, expect } from "vitest";
import { TimeSpan } from "../index.js";
import { SessionController } from "./index.js";

describe("SessionController", () => {
	const sessionController = new SessionController(new TimeSpan(1, "h"));
	describe("SessionController.validateSessionState()", () => {
		test("checks expiration", () => {
			const sessionId = "123";
			expect(sessionController.validateSessionState(sessionId, new Date(Date.now() - 1000))).toBe(
				null
			);
			expect(
				sessionController.validateSessionState(
					sessionId,
					new Date(Date.now() + new TimeSpan(1, "h").milliseconds())
				)
			).toStrictEqual({
				sessionId,
				expiresAt: new Date(Date.now() + new TimeSpan(1, "h").milliseconds()),
				fresh: false
			});
		});
		test("renews expiration", () => {
			const sessionId = "123";
			expect(
				sessionController.validateSessionState(
					sessionId,
					new Date(Date.now() + new TimeSpan(20, "m").milliseconds())
				)
			).toStrictEqual({
				sessionId,
				expiresAt: new Date(Date.now() + new TimeSpan(60, "m").milliseconds()),
				fresh: true
			});
		});
	});
});
