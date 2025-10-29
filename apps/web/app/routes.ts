import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	route("api/set-theme", "routes/api/set-theme.ts"),
	layout("routes/auth/auth.tsx", [
		route("login", "routes/auth/login.tsx"),
		route("onboarding", "routes/auth/onboarding.tsx"),
	]),
	layout("routes/app/app.tsx", [index("routes/app/index.tsx")]),
] satisfies RouteConfig;
