export function verifyRequestOrigin(
	origin: string | null | undefined,
	host: string | null | undefined,
	options?: {
		/** A list of allowed subdomains */
		allowedSubdomains?: string[] | "*";
	}
): boolean {
	if (!origin || !host) return false;
	const originHost = safeURL(origin)?.host ?? null;
	if (!originHost) return false;
	if (host.startsWith("http://") || host.startsWith("https://")) {
		host = safeURL(host)?.host ?? null;
	} else {
		// handle IDNs
		host = safeURL("https://" + host)?.host ?? null;
	}
	if (!host) return false;
	if (options?.allowedSubdomains === "*") {
		return originHost === host || originHost.endsWith("." + host);
	}
	const allowedSubdomains = options?.allowedSubdomains ?? [];
	if (allowedSubdomains.length === 0) {
		return originHost === host;
	}
	for (const allowedSubdomain of allowedSubdomains) {
		if (originHost === allowedSubdomain + "." + host) {
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
