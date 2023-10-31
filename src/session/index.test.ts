import { test, describe, expect } from "vitest";
import { TimeSpan, createDate } from "../index.js";
import { SessionController } from "./index.js";

describe("SessionController", () => {
	const sessionController = new SessionController(new TimeSpan(1, "h"));
	test("SessionController.getSessionState()", () => {
		expect(sessionController.getSessionState(createDate(new TimeSpan(60, "m")))).toBe("valid");
		expect(sessionController.getSessionState(createDate(new TimeSpan(-1, "m")))).toBe("expired");
		expect(sessionController.getSessionState(createDate(new TimeSpan(30, "m")))).toBe(
			"renewal_required"
		);
	});
});
