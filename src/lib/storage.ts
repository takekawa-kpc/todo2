import type { TodoList } from '../types'

export const STORAGE_KEY = 'todo-app.items'
export const BACKUP_KEY = 'todo-app.items.bak'
export const MAX_TEXT_LENGTH = 200

export type LoadResult = { list: TodoList; error: string | null }

function isValidList(value: unknown): value is TodoList {
  if (typeof value !== 'object' || value === null) return false
  const items = (value as TodoList).items
  if (!Array.isArray(items)) return false
  return items.every((item) => {
    if (typeof item !== 'object' || item === null) return false
    const { id, text, done, createdAt, updatedAt } = item as unknown as Record<string, unknown>
    return (
      typeof id === 'string' &&
      typeof text === 'string' &&
      typeof done === 'boolean' &&
      typeof createdAt === 'string' &&
      typeof updatedAt === 'string'
    )
  })
}

export function createItem(text: string) {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    text,
    done: false,
    createdAt: now,
    updatedAt: now,
  }
}

function backupRaw(raw: string) {
  try {
    localStorage.setItem(BACKUP_KEY, raw)
  } catch {
    /* バックアップ失敗は無視 */
  }
}

export function loadList(): LoadResult {
  const empty: LoadResult = { list: { items: [] }, error: null }
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return empty
    const parsed: unknown = JSON.parse(raw)
    if (isValidList(parsed)) {
      return { list: parsed, error: null }
    }
    // 構造が異なるデータ: バックアップし、空リストで開始する
    backupRaw(raw)
    return empty
  } catch {
    // 壊れた JSON 等: 破損データをバックアップし、空リストで開始する
    if (raw !== null) backupRaw(raw)
    return empty
  }
}

export function saveList(list: TodoList): string | null {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return null
  } catch {
    // QuotaExceededError 等: 既存データは保持し、エラーメッセージを返す
    return '保存に失敗しました（容量超過の可能性）。既存データは保持されています。'
  }
}
