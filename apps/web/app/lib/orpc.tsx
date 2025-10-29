import type { AppRouter } from "@commentrr/api/orpc/router";
import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

const getBaseUrl = () => {
	if (import.meta.env.DEV) {
		// Local dev on wrangler/localhost
		return "http://localhost:8787";
	}
	// Fallback for SSR/Workers – let runtime set this
	return "https://api.commentrr.efobi.dev";
};

export const queryClient = getQueryClient();

const link = (request: Request) =>
	new RPCLink({
		url: `${getBaseUrl()}/api/rpc`,
		headers: () => {
			const headers = new Headers();
			const cookies = request.headers.get("cookie");
			if (cookies) {
				headers.set("cookie", cookies);
			}
			return headers;
		},
		interceptors: [
			onError((error) => {
				// Log the error to the console
				console.error("RPC Error:", error);
			}),
		],
	});

export const client: RouterClient<AppRouter> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>
				{children}
				<ReactQueryDevtools />
			</NuqsAdapter>
		</QueryClientProvider>
	);
}
