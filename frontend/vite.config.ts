import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// @ts-ignore
import * as envVars from "./.env.ts";

const define: Record<string, string | undefined> = {};

for (const [key, value] of Object.entries(envVars)) {
	define[`process.env.${key}`] = JSON.stringify(value);
}

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [react(), tsconfigPaths()],
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./test/setup.ts",
		},
		// vite config
		define,
	};
});
