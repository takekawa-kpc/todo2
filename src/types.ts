export interface TodoItem {
  id: string
  text: string
  done: boolean
  createdAt: string
  updatedAt: string
}

export type TodoList = { items: TodoItem[] }
