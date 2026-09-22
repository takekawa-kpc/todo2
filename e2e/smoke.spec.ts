import { test, expect } from '@playwright/test'

// セットアップ検証用のスモークテスト。機能実装は未着手。
test('ページが /todo2/ で読み込まれる', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('ToDo')
  await expect(page.getByRole('heading', { name: 'ToDo', exact: true })).toBeVisible()
})
