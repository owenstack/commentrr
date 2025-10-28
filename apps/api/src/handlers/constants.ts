import { env } from "cloudflare:workers";

export const getDeviceFromUserAgent = (
	userAgent: string,
): "Android" | "IPhone" | "Windows" | "MacOS" | "Linux" | "Unknown" => {
	const ua = (userAgent || "").toLowerCase();

	if (ua.includes("android")) return "Android";
	if (
		ua.includes("iphone") ||
		ua.includes("ipad") ||
		ua.includes("ipod") ||
		ua.includes("ios")
	)
		return "IPhone";
	if (ua.includes("windows")) return "Windows";
	if (
		ua.includes("macintosh") ||
		ua.includes("mac os x") ||
		ua.includes("mac os")
	)
		return "MacOS";
	if (ua.includes("linux")) return "Linux";

	return "Unknown";
};

export const CORS_ORIGINS = [
	"https://commentrr.efobi.dev",
	"http://localhost:5173",
	"http://localhost:3000",
];

export const frontendUrl =
	env.ENVIRONMENT === "production" ? CORS_ORIGINS[0] : CORS_ORIGINS[1];
