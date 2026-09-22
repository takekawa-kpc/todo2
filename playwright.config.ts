import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    // Vite の base (/todo2/) と一致させる
    baseURL: 'http://localhost:5173/todo2/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    // strictPort により 5173 で確実に起動する
    url: 'http://localhost:5173/todo2/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
