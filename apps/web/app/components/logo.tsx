import { Link } from "react-router";

export function Logo() {
	return (
		<Link to="/">
			<img src="/logo.png" alt="Logo" className="aspect-square size-8" />
		</Link>
	);
}
