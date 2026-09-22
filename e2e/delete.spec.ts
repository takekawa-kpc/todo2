import { test, expect } from '@playwright/test'

async function addTodo(page: import('@playwright/test').Page, text: string) {
  await page.getByTestId('add-input').fill(text)
  await page.getByTestId('add-input').press('Enter')
}

test.describe('ToDo の削除 (issue 04)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('削除ボタンで対象項目が削除される', async ({ page }) => {
    await addTodo(page, '残す')
    await addTodo(page, '消す')
    await expect(page.getByTestId('todo-item')).toHaveCount(2)

    // 「消す」項目の削除ボタン
    await page.getByTestId('todo-item').filter({ hasText: '消す' }).getByTestId('delete-button').click()

    const items = page.getByTestId('todo-item')
    await expect(items).toHaveCount(1)
    await expect(items.first()).toContainText('残す')
    await expect(items.first()).not.toContainText('消す')
  })

  test('全項目を削除すると空状態に戻る', async ({ page }) => {
    await addTodo(page, 'A')
    await page.getByTestId('todo-item').first().getByTestId('delete-button').click()
    await expect(page.getByTestId('empty-state')).toBeVisible()
  })

  test('削除は即座に localStorage に反映される', async ({ page }) => {
    await addTodo(page, 'A')
    await addTodo(page, 'B')
    await page.getByTestId('todo-item').filter({ hasText: 'A' }).getByTestId('delete-button').click()

    const items = page.getByTestId('todo-item')
    await expect(items).toHaveCount(1)
    await expect(items.first()).toContainText('B')
  })
})
