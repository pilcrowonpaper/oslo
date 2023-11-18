import { createDate, isWithinExpirationDate, TimeSpan } from "../index.js";
import { parseCookies, serializeCookie } from "../cookie/index.js";

import type { CookieAttributes } from "../cookie/index.js";

export type SessionState = "expired" | "active" | "idle";

export class SessionController {
	constructor(expiresIn: TimeSpan) {
		this.expiresIn = expiresIn;
	}

	public expiresIn: TimeSpan;

	public getSessionState(expiresAt: Date): SessionState {
		if (!isWithinExpirationDate(expiresAt)) {
			return "expired";
		}
		const activePeriodExpirationDate = new Date(
			expiresAt.getTime() - this.expiresIn.milliseconds() / 2
		);
		if (!isWithinExpirationDate(activePeriodExpirationDate)) {
			return "idle";
		}
		return "active";
	}

	public createExpirationDate(): Date {
		return createDate(this.expiresIn);
	}
}

export class SessionCookieController {
	constructor(
		cookieName: string,
		expiresIn: TimeSpan,
		options?: {
			secure?: boolean;
			path?: string;
			domain?: string;
			sameSite?: "lax" | "strict";
		}
	) {
		this.cookieName = cookieName;
		this.expiresIn = expiresIn;
		this.baseCookieAttributes = {
			secure: options?.secure ?? true,
			sameSite: options?.sameSite ?? "lax",
			httpOnly: true,
			path: options?.path ?? "/",
			domain: options?.domain
		};
	}

	public cookieName: string;
	public expiresIn: TimeSpan;
	private baseCookieAttributes: CookieAttributes;

	public createSessionCookie(sessionId: string): SessionCookie {
		return new SessionCookie(this.cookieName, sessionId, {
			...this.baseCookieAttributes,
			maxAge: this.expiresIn.seconds()
		});
	}

	public createBlankSessionCookie(): SessionCookie {
		return new SessionCookie(this.cookieName, "", {
			...this.baseCookieAttributes,
			maxAge: 0
		});
	}

	public parseCookies(header: string): string | null {
		const cookies = parseCookies(header);
		return cookies.get(this.cookieName) ?? null;
	}
}

export class SessionCookie {
	constructor(name: string, value: string, attributes?: CookieAttributes) {
		this.name = name;
		this.value = value;
		this.attributes = attributes ?? {};
	}
	public name: string;
	public value: string;
	public attributes: CookieAttributes;

	public serialize(): string {
		return serializeCookie(this.name, this.value, this.attributes);
	}
}
