import { expirationDate, isWithinExpirationDate, TimeSpan } from "../index.js";
import { parseCookieHeader, Cookie } from "../cookie/index.js";

import type { CookieAttributes } from "../cookie/index.js";

export interface Session {
	sessionId: string;
	expiresAt: Date;
	fresh: boolean;
}

export class SessionController {
	constructor(expiresIn: TimeSpan) {
		this.expiresIn = expiresIn;
	}
	public expiresIn: TimeSpan;

	public validateSessionState(
		sessionId: string,
		expiresAt: Date
	): Session | null {
		if (!isWithinExpirationDate(expiresAt)) {
			return null;
		}
		let fresh = false;
		const activePeriodExpirationDate = new Date(
			expiresAt.getTime() - this.expiresIn.milliseconds() / 2
		);
		if (!isWithinExpirationDate(activePeriodExpirationDate)) {
			// extend expiration
			expiresAt = expirationDate(this.expiresIn);
			fresh = true;
		}
		return {
			sessionId,
			expiresAt,
			fresh
		};
	}

	public createSession(sessionId: string) {
		return {
			sessionId,
			expiresAt: expirationDate(this.expiresIn),
			fresh: true
		};
	}

	public sessionCookie(options: SessionCookieOptions): SessionCookieController {
		return new SessionCookieController(this, options);
	}
}

export interface SessionCookieOptions {
	name: string;
	secure: boolean;
	path?: string;
	domain?: string;
	sameSite?: "lax" | "strict";
}

export class SessionCookieController {
	constructor(
		sessionCookieController: SessionController,
		options: SessionCookieOptions
	) {
		this.sessionExpiresIn = sessionCookieController.expiresIn;
		this.cookieName = options.name;
		this.baseCookieAttributes = {
			secure: options.secure,
			sameSite: options.sameSite ?? "lax",
			httpOnly: true,
			path: options.path ?? "/",
			domain: options.domain
		};
	}

	public cookieName: string;
	private sessionExpiresIn: TimeSpan;
	private baseCookieAttributes: CookieAttributes;

	public createSessionCookie(sessionId: string): Cookie {
		return new Cookie(this.cookieName, sessionId, {
			...this.baseCookieAttributes,
			maxAge: Math.ceil(this.sessionExpiresIn.seconds())
		});
	}

	public createBlankSessionCookie(): Cookie {
		return new Cookie(this.cookieName, "", {
			...this.baseCookieAttributes,
			maxAge: 0
		});
	}

	public parseCookieHeader(header: string | null | undefined): string | null {
		const cookies = parseCookieHeader(header);
		return cookies.get(this.cookieName) ?? null;
	}
}
