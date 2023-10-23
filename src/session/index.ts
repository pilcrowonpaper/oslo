import { expirationDate, isWithinExpirationDate, TimeSpan } from "../index.js";
import { parseCookieHeader, serializeCookie } from "../cookie/index.js";

import type { CookieAttributes } from "../cookie/index.js";

export interface Session {
	sessionId: string;
	expiresAt: Date;
	fresh: boolean;
}

export class SessionController {
	/**
	 * @param expiresIn How long the session is valid for
	 */
	constructor(expiresIn: TimeSpan) {
		this.expiresIn = expiresIn;
	}

	/** How long the session is valid for */
	public expiresIn: TimeSpan;

	/**
	 * Checks the session expiration and extends the expiration if necessary.
	 * As such, the date in the returned `Session` may not match the provided date.
	 *
	 * @param sessionId
	 * @param expiresAt Session expiration stored in the database
	 */
	public validateSessionState(sessionId: string, expiresAt: Date): Session | null {
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

	public createSession(sessionId: string): Session {
		return {
			sessionId,
			expiresAt: expirationDate(this.expiresIn),
			fresh: true
		};
	}

	public sessionCookieController(
		cookieName: string,
		options?: SessionCookieOptions
	): SessionCookieController {
		return new SessionCookieController(cookieName, this.expiresIn, options);
	}
}

interface SessionCookieOptions {
	expires?: boolean;
	secure?: boolean;
	path?: string;
	domain?: string;
	sameSite?: "lax" | "strict";
}

export class SessionCookieController {
	constructor(cookieName: string, sessionExpiresIn: TimeSpan, options?: SessionCookieOptions) {
		this.cookieName = cookieName;
		if (options?.expires) {
			this.sessionExpiresIn = sessionExpiresIn;
		} else {
			this.sessionExpiresIn = new TimeSpan(52 * 2, "w");
		}
		this.baseCookieAttributes = {
			secure: options?.secure ?? true,
			sameSite: options?.sameSite ?? "lax",
			httpOnly: true,
			path: options?.path ?? "/",
			domain: options?.domain
		};
	}

	public cookieName: string;
	private sessionExpiresIn: TimeSpan;
	private baseCookieAttributes: CookieAttributes;

	public createSessionCookie(sessionId: string): SessionCookie {
		return new SessionCookie(this.cookieName, sessionId, {
			...this.baseCookieAttributes,
			maxAge: this.sessionExpiresIn.seconds()
		});
	}

	/**Creates a new `Cookie` that deletes the existing cookie when set. */
	public createBlankSessionCookie(): SessionCookie {
		return new SessionCookie(this.cookieName, "", {
			...this.baseCookieAttributes,
			maxAge: 0
		});
	}

	public parseCookieHeader(header: string | null | undefined): string | null {
		const cookies = parseCookieHeader(header);
		return cookies.get(this.cookieName) ?? null;
	}
}

export class SessionCookie {
	constructor(name: string, value: string, attributes: CookieAttributes) {
		this.name = name;
		this.value = value;
		this.attributes = attributes;
	}
	public name: string;
	public value: string;
	public attributes: CookieAttributes;

	public serialize(): string {
		return serializeCookie(this.name, this.value, this.attributes);
	}
}
