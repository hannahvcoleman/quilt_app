import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	// Do not start a web server automatically — dev server must be running.
	webServer: undefined,
});
