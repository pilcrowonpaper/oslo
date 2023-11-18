import { test, describe, expect } from "vitest";
import { TimeSpan, createDate } from "../index.js";
import { SessionController, SessionCookieController, SessionCookie } from "./index.js";

describe("SessionController", () => {
	const sessionController = new SessionController(new TimeSpan(1, "h"));

	test("createExpirationDate()", () => {
		expect(sessionController.createExpirationDate()).toEqual(createDate(new TimeSpan(1, "h")));
	});

	test("getSessionState()", () => {
		expect(sessionController.getSessionState(createDate(new TimeSpan(60, "m")))).toBe("active");
		expect(sessionController.getSessionState(createDate(new TimeSpan(-30, "m")))).toBe("expired");
		expect(sessionController.getSessionState(createDate(new TimeSpan(30, "m")))).toBe("idle");
	});
});

describe("SessionCookieController", () => {
	const sessionCookieController = new SessionCookieController("session", new TimeSpan(1, "h"));

	test("createSessionCookie()", () => {
		expect(sessionCookieController.createSessionCookie("SESSION_ID")).toEqual(
			new SessionCookie("session", "SESSION_ID", {
				maxAge: new TimeSpan(1, "h").seconds(),
				httpOnly: true,
				secure: true,
				path: "/",
				sameSite: "lax"
			})
		);
	});

	test("createBlankSessionCookie()", () => {
		expect(sessionCookieController.createBlankSessionCookie()).toEqual(
			new SessionCookie("session", "", {
				maxAge: 0,
				httpOnly: true,
				secure: true,
				path: "/",
				sameSite: "lax"
			})
		);
	});
});
