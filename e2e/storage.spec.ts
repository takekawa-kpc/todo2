import { test, expect, type Page } from '@playwright/test'

async function addTodo(page: Page, text: string) {
  await page.getByTestId('add-input').fill(text)
  await page.getByTestId('add-input').press('Enter')
}

test.describe('localStorage による永続化 (issue 01)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('追加・削除はページ再読み込み後も保持される', async ({ page }) => {
    await addTodo(page, '買い物リストを作成')
    await addTodo(page, 'メール返信')

    await page.reload()

    const items = page.getByTestId('todo-item')
    await expect(items).toHaveCount(2)
    await expect(items.nth(0)).toContainText('メール返信')
    await expect(items.nth(1)).toContainText('買い物リストを作成')
  })

  test('localStorage のキー名とデータ構造が仕様通りである', async ({ page }) => {
    await addTodo(page, 'データ確認')

    const raw = await page.evaluate(() => localStorage.getItem('todo-app.items'))
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string)
    expect(Array.isArray(parsed.items)).toBe(true)
    expect(parsed.items).toHaveLength(1)
    const item = parsed.items[0]
    expect(item).toMatchObject({ text: 'データ確認', done: false })
    expect(typeof item.id).toBe('string')
    expect(typeof item.createdAt).toBe('string')
    expect(typeof item.updatedAt).toBe('string')
  })

  test('壊れた JSON の場合、クラッシュせず空リスト + バックアップが作られる', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('todo-app.items', '{"items": [壊れたデータ')
    })
    await page.reload()

    await expect(page.getByTestId('empty-state')).toBeVisible()
    const backup = await page.evaluate(() => localStorage.getItem('todo-app.items.bak'))
    expect(backup).toBe('{"items": [壊れたデータ')
  })

  test('非 JSON な値の場合も空リストで初期化される', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('todo-app.items', 'not-json')
    })
    await page.reload()
    await expect(page.getByTestId('empty-state')).toBeVisible()
  })

  test('構造が異なるデータの場合も空リストで初期化される', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('todo-app.items', '{"items": [{"id": 123}]}')
    })
    await page.reload()
    await expect(page.getByTestId('empty-state')).toBeVisible()
  })

  test('保存に失敗した場合はエラーメッセージを表示し既存データは失われない', async ({ page }) => {
    await addTodo(page, '保存失敗テスト')

    // setItem が QuotaExceededError を投げるように置き換える
    await page.evaluate(() => {
      Storage.prototype.setItem = function () {
        throw new DOMException('quota exceeded', 'QuotaExceededError')
      }
    })

    await addTodo(page, 'これ以降は保存できない')

    await expect(page.getByTestId('storage-error')).toBeVisible()

    // 既存データ（最初に加えた項目）はリストに残っている
    await expect(page.getByTestId('todo-item')).toHaveCount(2)
  })
})
