interface MagicLinkEmailProps {
	magicLink?: string;
}

export function magicLinkEmailString({
	magicLink,
}: MagicLinkEmailProps): string {
	const bodyStyle = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #ffffff; margin: 0; padding: 0;`;
	const containerStyle = `padding-left: 12px; padding-right: 12px; margin: 0 auto; max-width: 600px;`;
	const h1Style = `color: #333; font-size: 24px; font-weight: bold; margin: 40px 0; padding: 0;`;
	const textStyle = `color: #333; font-size: 14px; margin: 24px 0;`;
	const footerStyle = `color: #898989; font-size: 12px; line-height: 22px; margin-top: 12px; margin-bottom: 24px;`;
	const linkStyle = `color: #2754C5; font-size: 14px; text-decoration: underline;`;
	const magicLinkStyle = `color: #2754C5; font-size: 14px;`;

	return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="${bodyStyle}">
<div style="${containerStyle}">
<img src="/logo.png" width="128" height="128" alt="commentrr.efobi.dev's Logo" />
<h1 style="${h1Style}">Your magic link</h1>
<p style="${textStyle}">
    <a href="${magicLink}" style="${magicLinkStyle}">👉 Click here to sign in 👈</a>
</p>
<p style="${textStyle}">If you didn't request this, please ignore this email.</p>
<div style="${footerStyle}">
Your sincerely,<br />
The commentrr.efobi.dev Team<br />
<a href="https://commentrr.efobi.dev" style="${linkStyle}">commentrr.efobi.dev</a>
</div>
</div>
</body>
</html>`;
}
