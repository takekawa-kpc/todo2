import { useEffect, useId, useState } from 'react'
import { createItem, loadList, saveList, MAX_TEXT_LENGTH } from './lib/storage'
import { formatDateTime } from './lib/format'
import type { TodoItem, TodoList } from './types'

export default function App() {
  const [list, setList] = useState<TodoList>(() => loadList().list)
  const [storageError, setStorageError] = useState<string | null>(() => loadList().error)
  const [draft, setDraft] = useState('')

  const listId = useId()
  const inputId = useId()

  useEffect(() => {
    setStorageError(saveList(list))
  }, [list])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (text.length === 0 || text.length > MAX_TEXT_LENGTH) return
    setList((prev) => ({ items: [createItem(text), ...prev.items] }))
    setDraft('')
  }

  function handleDelete(id: string) {
    setList((prev) => ({ items: prev.items.filter((item) => item.id !== id) }))
  }

  const remaining = list.items.filter((item) => !item.done).length

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[640px] flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">ToDo</h1>
      </header>

      {storageError && (
        <p
          role="alert"
          data-testid="storage-error"
          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {storageError}
        </p>
      )}

      <form data-testid="add-form" aria-label="ToDo を追加" onSubmit={handleAdd}>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            data-testid="add-input"
            aria-label="新しい ToDo"
            placeholder="新しい ToDo を入力"
            value={draft}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-900"
          />
          <button
            type="submit"
            data-testid="add-button"
            disabled={draft.trim().length === 0}
            className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-neutral-950"
          >
            追加
          </button>
        </div>
        <p className="mt-1 text-right text-xs text-neutral-400 dark:text-neutral-500">
          {draft.length}/{MAX_TEXT_LENGTH}
        </p>
      </form>

      <section aria-labelledby={listId}>
        <h2 id={listId} className="sr-only">
          ToDo リスト
        </h2>
        {list.items.length === 0 ? (
          <p
            data-testid="empty-state"
            className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-400"
          >
            ToDo ありません
          </p>
        ) : (
          <ul className="flex flex-col gap-2" data-testid="todo-list">
            {list.items.map((item: TodoItem) => (
              <li
                key={item.id}
                data-testid="todo-item"
                className="animate-fade-in flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 transition dark:border-neutral-700 dark:bg-neutral-900"
              >
                <label className="flex min-w-0 flex-1 cursor-default items-center gap-3">
                  <input
                    type="checkbox"
                    aria-label={`${item.text} の完了状態`}
                    className="size-4 accent-indigo-600"
                    checked={item.done}
                    readOnly
                    disabled
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">{item.text}</span>
                  <time
                    dateTime={item.createdAt}
                    className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500"
                  >
                    {formatDateTime(item.createdAt)}
                  </time>
                </label>
                <button
                  type="button"
                  data-testid="delete-button"
                  aria-label={`${item.text} を削除`}
                  onClick={() => handleDelete(item.id)}
                  className="shrink-0 rounded-md px-2 py-1 text-sm text-neutral-500 transition hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500 dark:text-neutral-400 dark:hover:bg-red-950"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="text-sm text-neutral-500 dark:text-neutral-400">
        <p data-testid="remaining-count" aria-live="polite">
          残り {remaining} 件
        </p>
      </footer>
    </main>
  )
}
