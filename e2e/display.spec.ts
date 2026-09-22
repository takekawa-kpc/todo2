import { test, expect } from '@playwright/test'

async function addTodo(page: import('@playwright/test').Page, text: string) {
  await page.getByTestId('add-input').fill(text)
  await page.getByTestId('add-input').press('Enter')
}

test.describe('ToDo の表示 (issue 03)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('一覧が空の場合は空状態を表示する', async ({ page }) => {
    await expect(page.getByTestId('empty-state')).toHaveText('ToDo ありません')
    await expect(page.getByTestId('todo-list')).not.toBeInViewport()
  })

  test('本文・作成日時・チェックボックスが表示される', async ({ page }) => {
    await addTodo(page, 'レポートを書く')

    const item = page.getByTestId('todo-item').first()
    await expect(item).toContainText('レポートを書く')
    // 作成日時: YYYY/MM/DD HH:mm
    await expect(item.locator('time')).toHaveText(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/)
    await expect(item.locator('input[type="checkbox"]')).toBeVisible()
    const datetime = await item.locator('time').getAttribute('datetime')
    expect(datetime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)
  })

  test('新しい順（先頭に追加）に表示される', async ({ page }) => {
    await addTodo(page, '最初')
    await addTodo(page, '二つ目')
    await addTodo(page, '三つ目')

    const items = page.getByTestId('todo-item')
    await expect(items).toHaveCount(3)
    await expect(items.nth(0)).toContainText('三つ目')
    await expect(items.nth(1)).toContainText('二つ目')
    await expect(items.nth(2)).toContainText('最初')
  })

  test('複数項目を追加しても残件数（フッター）が更新される', async ({ page }) => {
    await addTodo(page, 'A')
    await addTodo(page, 'B')
    await expect(page.getByTestId('remaining-count')).toHaveText('残り 2 件')
  })
})
