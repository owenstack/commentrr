import type { AppRouter } from "@commentrr/api/trpc/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import superjson from "superjson";

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

const links = [
	loggerLink({
		enabled: (op) =>
			import.meta.env.DEV ||
			(op.direction === "down" && op.result instanceof Error),
	}),
	httpBatchLink({
		transformer: superjson,
		url: `${getBaseUrl()}/api/trpc`,
		fetch: (url, options) => {
			return fetch(url, {
				...options,
				credentials: "include",
				body: options?.body ? String(options.body) : undefined,
			});
		},
	}),
];

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
	const [trpcClient] = useState(() =>
		createTRPCProxyClient<AppRouter>({
			links,
		}),
	);
	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				<NuqsAdapter>
					{children}
					<ReactQueryDevtools />
				</NuqsAdapter>
			</TRPCProvider>
		</QueryClientProvider>
	);
}

export const caller = (args: LoaderFunctionArgs) => {
	return createTRPCProxyClient<AppRouter>({
		links: [
			loggerLink({
				enabled: (op) =>
					import.meta.env.DEV ||
					(op.direction === "down" && op.result instanceof Error),
			}),
			httpBatchLink({
				url: `${getBaseUrl()}/api/trpc`,
				transformer: superjson,
				headers() {
					// Forward the cookie from the browser's request to the API request
					// This is the key to making authentication work in loaders
					const headers = new Headers();
					const cookie = args.request.headers.get("cookie");
					if (cookie) {
						headers.set("cookie", cookie);
					}
					// Also forward the user-agent if you want
					const userAgent = args.request.headers.get("user-agent");
					if (userAgent) {
						headers.set("user-agent", userAgent);
					}
					return headers;
				},
			}),
		],
	});
};
