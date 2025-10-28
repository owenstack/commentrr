import { TRPCClientError } from "@trpc/client";
import {
	Building,
	CheckCheck,
	FileBox,
	type LucideIcon,
	UserPen,
} from "lucide-react";
import { redirect } from "react-router";

export const handleLoader = async <T>(loader: () => Promise<T>) => {
	try {
		return await loader();
	} catch (error) {
		if (error instanceof TRPCClientError) {
			if (error.data?.code === "UNAUTHORIZED") {
				throw redirect("/login");
			}
		}
		console.error("Error loading data:", error);
		return null;
	}
};

export const CORS_ORIGINS = [
	"https://commentrr.efobi.dev",
	"http://localhost:5173",
	"http://localhost:3000",
];

export const frontendUrl = import.meta.env.PROD
	? CORS_ORIGINS[0]
	: CORS_ORIGINS[1];

export const steps: {
	title: string;
	icon: LucideIcon;
}[] = [
	{
		title: "Update profile",
		icon: UserPen,
	},
	{
		title: "Create your first organization",
		icon: Building,
	},
	{
		title: "Create your projects",
		icon: FileBox,
	},
	{
		title: "All set!",
		icon: CheckCheck,
	},
];
