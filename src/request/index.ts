/** Checks if the domain of the origin matches the host domain to prevent CSRF attacks.
 *
 * By default, host of the origin url must exactly match the provided host.
 * To allow subdomains, pass a list of subdomains to `options.allowedSubdomains`,
 * where the base domain is the host base domain.
 * For example, if the host is api.example.com, the base domain is example.com.
 * Alternatively pass `"*"` to allow all subdomains, including those with no subdomains.
 *
 * Set `options.allowBaseDomain` to `true` to allow the base domain.
 */
export function verifyRequestOrigin(
	origin: string | null | undefined,
	host: string | null | undefined,
	options?: {
		/** A list of allowed subdomains */
		allowedSubdomains?: string[] | "*";
		allowBaseDomain?: boolean;
	}
): boolean {
	if (!origin || !host) return false;
	const originHost = safeURL(origin)?.host ?? null;
	if (!originHost) return false;
	if (host.startsWith("https//") || host.startsWith("https://")) {
		host = safeURL(host)?.host ?? null;
	}
	if (!host) return false;
	const allowBaseDomain = options?.allowBaseDomain ?? false;
	const hostBaseDomain = host.split(".").slice(-2).join(".");
	if (allowBaseDomain && originHost === hostBaseDomain) {
		return true;
	}
	const allowedSubdomains = options?.allowedSubdomains ?? [];
	if (allowedSubdomains.length === 0) {
		return originHost === host;
	}
	if (allowedSubdomains === "*") {
		return originHost === hostBaseDomain || originHost.endsWith("." + hostBaseDomain);
	}
	for (const allowedSubdomain of allowedSubdomains) {
		if (originHost === allowedSubdomain + "." + hostBaseDomain) {
			return true;
		}
	}
	return originHost === host;
}

function safeURL(url: URL | string): URL | null {
	try {
		return new URL(url);
	} catch {
		return null;
	}
}
