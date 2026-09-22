import { test, expect } from '@playwright/test'

test.describe('ToDo の追加 (issue 02)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('テキストを入力して Enter キーで追加できる', async ({ page }) => {
    await page.getByTestId('add-input').fill('買い物に行く')
    await page.getByTestId('add-input').press('Enter')

    const item = page.getByTestId('todo-item').first()
    await expect(item).toHaveText(/買い物に行く/)
    await expect(page.getByTestId('empty-state')).not.toBeVisible()
  })

  test('「追加」ボタンでも追加できる', async ({ page }) => {
    await page.getByTestId('add-input').fill('メールを確認する')
    await page.getByTestId('add-button').click()

    await expect(page.getByTestId('todo-item').first()).toHaveText(/メールを確認する/)
  })

  test('空・空白のみでは追加できない', async ({ page }) => {
    await expect(page.getByTestId('add-button')).toBeDisabled()

    await page.getByTestId('add-input').fill('   ')
    await page.getByTestId('add-input').press('Enter')
    await expect(page.getByTestId('empty-state')).toBeVisible()
    await expect(page.getByTestId('todo-item')).toHaveCount(0)
  })

  test('200 文字を超える入力は制限される', async ({ page }) => {
    const longText = 'あ'.repeat(250)
    const input = page.getByTestId('add-input')
    await input.fill(longText)
    await expect(input).toHaveValue('あ'.repeat(200))

    await page.getByTestId('add-button').click()
    // 200 文字で切り詰められたテキストが含まれていること
    await expect(page.getByTestId('todo-item')).toContainText('あ'.repeat(200))
    // 201 文字目以降が含まれていないこと
    await expect(page.getByTestId('todo-item')).not.toContainText('あ'.repeat(201))
  })

  test('追加後、入力欄が空になりフォーカスが維持される', async ({ page }) => {
    await page.getByTestId('add-input').fill('タスクA')
    await page.getByTestId('add-input').press('Enter')

    await expect(page.getByTestId('add-input')).toHaveValue('')
    await expect(page.getByTestId('add-input')).toBeFocused()
  })
})
