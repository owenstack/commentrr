import {
	adminClient,
	magicLinkClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	baseURL: import.meta.env.DEV
		? "http://localhost:8787"
		: "https://api.commentrr.efobi.dev",
	plugins: [adminClient(), organizationClient(), magicLinkClient()],
});

export const {
	signIn,
	signUp,
	useSession,
	admin,
	changeEmail,
	changePassword,
	deleteUser,
	verifyEmail,
	forgetPassword,
	getSession,
	signOut,
	updateUser,
	resetPassword,
	sendVerificationEmail,
	organization,
	useListOrganizations,
	useActiveMember,
	useActiveMemberRole,
	useActiveOrganization,
	revokeOtherSessions,
} = authClient;
