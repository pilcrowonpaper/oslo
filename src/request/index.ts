export function verifyRequestOrigin(
	origin: string | null | undefined,
	config: {
		host: string | null | undefined;
		allowedSubdomains?: Array<string | null> | "*";
	}
): boolean {
	if (!origin || !config.host) return false;
	const originHost = safeURL(origin)?.host ?? null;
	if (!originHost) return false;
	let host: string | null;
	if (config.host.startsWith("https//") || config.host.startsWith("https://")) {
		host = safeURL(config.host)?.host ?? null;
	} else {
		host = config.host.split(":").at(0) ?? null;
	}
	if (!host) return false;
	if (!config?.allowedSubdomains) {
		return originHost === host;
	}
	const hostBaseDomain = host.split(".").slice(-2).join(".");
	if (config.allowedSubdomains === "*") {
		return (
			originHost === hostBaseDomain || originHost.endsWith("." + hostBaseDomain)
		);
	}
	for (const allowedSubdomain of config.allowedSubdomains) {
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
