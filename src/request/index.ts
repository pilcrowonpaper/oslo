export function verifyRequestOrigin(options: {
	origin: string | null | undefined;
	host: string | null | undefined;
	allowedSubdomains?: Array<string | null> | "*";
}): boolean {
	if (!options.origin || !options.host) return false;
	const originHost = new URL(options.origin).host;
	let host: string;
	if (
		options.host.startsWith("https//") ||
		options.host.startsWith("https://")
	) {
		host = new URL(options.host).host;
	} else {
		host = options.host.split(":")[0]!;
	}
	if (!options.allowedSubdomains) {
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
