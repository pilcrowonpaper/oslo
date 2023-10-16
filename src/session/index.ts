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

	public sessionCookie(options: SessionCookieConfig): SessionCookieController {
		return new SessionCookieController(this, options);
	}
}

export interface SessionCookieAttributesOptions {
	path?: string;
	domain?: string;
	sameSite?: "lax" | "strict";
}

export interface SessionCookieConfig {
	name: string;
	secure: boolean;
	attributes?: SessionCookieAttributesOptions;
	expires?: boolean;
}

export class SessionCookieController {
	constructor(
		sessionCookieController: SessionController,
		options: SessionCookieConfig
	) {
		this.sessionExpiresIn = sessionCookieController.expiresIn;
		this.cookieName = options.name;
		this.cookieExpires = options.expires ?? true;
		this.baseCookieAttributes = {
			secure: options.secure,
			sameSite: options.attributes?.sameSite ?? "lax",
			httpOnly: true,
			path: options.attributes?.path ?? "/",
			domain: options.attributes?.domain
		};
	}

	public cookieName: string;
	private cookieExpires: boolean;
	private sessionExpiresIn: TimeSpan;
	private baseCookieAttributes: CookieAttributes;

	public createSessionCookie(sessionId: string): Cookie {
		const maxAge = this.cookieExpires
			? this.sessionExpiresIn.seconds()
			: new TimeSpan(52 * 2, "w").seconds();
		return new Cookie(this.cookieName, sessionId, {
			...this.baseCookieAttributes,
			maxAge
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
