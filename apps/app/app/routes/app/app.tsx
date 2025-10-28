import { Outlet } from "react-router";
import { Header } from "~/components/header";

export default function AppLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="mt-16 p-4">
				<Outlet />
			</main>
		</div>
	);
}
