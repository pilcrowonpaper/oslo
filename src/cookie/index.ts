export interface CookieAttributes {
	secure?: boolean;
	path?: string;
	domain?: string;
	sameSite?: "lax" | "strict" | "none";
	httpOnly?: boolean;
	maxAge?: number;
	expires?: Date;
}

export function serializeCookie(
	name: string,
	value: string,
	attributes: CookieAttributes = {}
): string {
	const keyValueEntries: Array<[string, string | number] | [string]> = [];
	keyValueEntries.push([encodeURIComponent(name), encodeURIComponent(value)]);
	if (attributes?.domain !== undefined) {
		keyValueEntries.push(["Domain", attributes.domain]);
	}
	if (attributes?.expires !== undefined) {
		keyValueEntries.push(["Expires", attributes.expires.toUTCString()]);
	}
	if (attributes?.httpOnly) {
		keyValueEntries.push(["HttpOnly"]);
	}
	if (attributes?.maxAge !== undefined) {
		keyValueEntries.push(["MaxAge", attributes.maxAge]);
	}
	if (attributes?.path !== undefined) {
		keyValueEntries.push(["Path", attributes.path]);
	}
	if (attributes?.sameSite === "lax") {
		keyValueEntries.push(["SameSite", "Lax"]);
	}
	if (attributes?.sameSite === "none") {
		keyValueEntries.push(["SameSite", "None"]);
	}
	if (attributes?.sameSite === "strict") {
		keyValueEntries.push(["SameSite", "Strict"]);
	}
	if (attributes?.secure) {
		keyValueEntries.push(["Secure"]);
	}
	return keyValueEntries.map((pair) => pair.join("=")).join("; ");
}

export function parseCookieHeader(header: string | null | undefined): Cookies {
	const cookieEntries: Array<[string, string]> = [];
	const items = header?.split("; ") ?? [];
	for (const item of items) {
		const pair = item.split("=");
		const rawKey = pair[0];
		const rawValue = pair[1];
		if (!rawKey || !rawValue) continue;
		cookieEntries.push([decodeURIComponent(rawKey), decodeURIComponent(rawValue)]);
	}
	const cookies = new Cookies(cookieEntries);
	return cookies;
}

export class Cookies {
	constructor(cookies: Record<string, string> | Array<[string, string]>) {
		const entries = Array.isArray(cookies) ? cookies : Object.entries(cookies);
		for (const [name, value] of entries) {
			this.internal.set(name, value);
		}
	}
	private internal = new Map<string, string>();
	public get(cookieName: string): string | null {
		return this.internal.get(cookieName) ?? null;
	}
	public entries(): IterableIterator<[string, string]> {
		return this.internal.entries();
	}
}

export class Cookie {
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
