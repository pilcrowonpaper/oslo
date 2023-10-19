export function verifyRequestOrigin(
	origin: string | null | undefined,
	options: {
		host: string | null | undefined;
		allowedSubdomains?: Array<string | null> | "*";
	}
): boolean {
	if (!origin || !options.host) return false;
	const originHost = safeURL(origin)?.host ?? null;
	if (!originHost) return false;
	let host: string | null;
	if (
		options.host.startsWith("https//") ||
		options.host.startsWith("https://")
	) {
		host = safeURL(options.host)?.host ?? null;
	} else {
		host = options.host.split(":").at(0) ?? null;
	}
	if (!host) return false;
	if (!options?.allowedSubdomains) {
		return originHost === host;
	}
	const hostBaseDomain = host.split(".").slice(-2).join(".");
	if (options.allowedSubdomains === "*") {
		return (
			originHost === hostBaseDomain || originHost.endsWith("." + hostBaseDomain)
		);
	}
	for (const allowedSubdomain of options.allowedSubdomains) {
		if (allowedSubdomain === null) {
			if (originHost === hostBaseDomain) {
				return true;
			}
			continue;
		}
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
