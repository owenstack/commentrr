import dns from "node:dns";

const FREE_EMAIL_PROVIDERS = [
	"gmail.com",
	"yahoo.com",
	"outlook.com",
	"hotmail.com",
	"icloud.com",
	"aol.com",
	"protonmail.com",
	"zoho.com",
	"yandex.com",
	"gmx.com",
];

const DISPOSABLE_DOMAINS = [
	"tempmail.com",
	"mailinator.com",
	"guerrillamail.com",
	"10minutemail.com",
	"trashmail.com",
	"fakeinbox.com",
	"dispostable.com",
	"sharklasers.com",
];

export async function validateEmail(email: string) {
	const domain = email.split("@")[1]?.toLowerCase();
	if (FREE_EMAIL_PROVIDERS.includes(domain)) {
		throw new Error("Please use your work email address.");
	}
	if (DISPOSABLE_DOMAINS.includes(domain)) {
		throw new Error("Disposable email addresses are not allowed.");
	}
	if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
		throw new Error("Invalid email domain format.");
	}
	const mxRecords = await dns.promises.resolveMx(domain);
	if (!mxRecords.length)
		throw new Error("Invalid email domain. Please use a valid work email");
	return email;
}
