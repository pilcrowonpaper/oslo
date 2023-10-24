import { test, describe, expect } from "vitest";
import { TimeSpan } from "../index.js";
import { SessionController } from "./index.js";

describe("SessionController", () => {
	const sessionController = new SessionController(new TimeSpan(1, "h"));
	describe("SessionController.validateSessionState()", () => {
		test("checks expiration", () => {
			const sessionId = "123";
			const currDateTime = Date.now();
			expect(sessionController.validateSessionState(sessionId, new Date(currDateTime - 1000))).toBe(
				null
			);
			expect(
				sessionController.validateSessionState(
					sessionId,
					new Date(currDateTime + new TimeSpan(1, "h").milliseconds())
				)
			).toStrictEqual({
				sessionId,
				expiresAt: new Date(currDateTime + new TimeSpan(1, "h").milliseconds()),
				fresh: false
			});
		});
		test("renews expiration", () => {
			const sessionId = "123";
			const currDateTime = Date.now();
			expect(
				sessionController.validateSessionState(
					sessionId,
					new Date(currDateTime + new TimeSpan(20, "m").milliseconds())
				)
			).toStrictEqual({
				sessionId,
				expiresAt: new Date(currDateTime + new TimeSpan(60, "m").milliseconds()),
				fresh: true
			});
		});
	});
});
