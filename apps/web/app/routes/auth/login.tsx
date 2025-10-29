import type { FormEvent } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signIn } from "~/lib/auth";
import { frontendUrl } from "~/lib/constants";

export default function Page() {
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		if (!email.trim()) {
			toast.error("Please enter a valid email address.");
			return;
		}
		toast.promise(
			signIn.magicLink({
				email,
				callbackURL: frontendUrl,
				newUserCallbackURL: `${frontendUrl}/onboarding`,
			}),
			{
				loading: "Sending login email...",
				success: (res) => {
					if (res.error) {
						toast.error(res.error.code, {
							description: res.error.message,
						});
						return "Failed to send login email. Please try again.";
					}
					return "Login email sent successfully. Please check your email!";
				},
				error: "Failed to send login email. Please try again.",
			},
		);
		e.currentTarget.reset();
	};
	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">
						Welcome to commentrr.efobi.dev
					</CardTitle>
					<CardDescription>
						Sign in with your work email address
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<form onSubmit={handleSubmit} className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="email">Email address</Label>
								<Input name="email" type="email" autoComplete="work email" />
							</div>
							<Button type="submit">Sign in</Button>
						</form>
					</div>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[Link]:underline-offset-4">
				By clicking continue, you agree to our{" "}
				<Link to="https://efobi.dev/tos">Terms of Service</Link> and{" "}
				<Link to="https://efobi.dev/privacy">Privacy Policy</Link>.
			</div>
		</div>
	);
}
