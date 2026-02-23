import { nanoid as generateId } from "nanoid";
import { Repeat } from "./reducer";

export function addTodo(
  contents = "",
  meta?: { dueDate?: string; repeat?: Repeat; listId?: string },
) {
  return {
    type: "ADD_TODO",
    data: {
      contents,
      id: generateId(),
      completed: false,
      dueDate: meta?.dueDate,
      repeat: meta?.repeat,
      listId: meta?.listId,
    },
  } as const;
}

export function removeTodo(id: string) {
  return {
    type: "REMOVE_TODO",
    data: { id },
  } as const;
}

export function toggleTodo(id: string) {
  return {
    type: "TOGGLE_TODO",
    data: { id },
  } as const;
}

export function dismissTodo(id: string) {
  return {
    type: "DISMISS_TODO",
    data: { id },
  } as const;
}

export function updateTodo(id: string, contents: string) {
  return {
    type: "UPDATE_TODO",
    data: { id, contents },
  } as const;
}

export function updateTodoMeta(
  id: string,
  meta: { dueDate?: string; repeat?: Repeat },
) {
  return {
    type: "UPDATE_TODO_META",
    data: { id, ...meta },
  } as const;
}

export function completeInstance(id: string) {
  return {
    type: "COMPLETE_INSTANCE",
    data: { id },
  } as const;
}

export function completeTask(id: string) {
  return {
    type: "COMPLETE_TASK",
    data: { id },
  } as const;
}

export function completeRepeatInstance(
  parentId: string,
  instanceDueDate: string | undefined,
  nextDueDate: string,
) {
  return {
    type: "COMPLETE_REPEAT_INSTANCE",
    data: {
      parentId,
      instanceId: generateId(),
      instanceDueDate,
      nextDueDate,
    },
  } as const;
}

export function uncompleteRepeatInstance(
  instanceId: string,
  parentId: string,
  instanceDueDate?: string,
) {
  return {
    type: "UNCOMPLETE_REPEAT_INSTANCE",
    data: { instanceId, parentId, instanceDueDate },
  } as const;
}

export function moveTodo(id: string, listId?: string) {
  return {
    type: "MOVE_TODO",
    data: { id, listId },
  } as const;
}

export type Action =
  | ReturnType<typeof addTodo>
  | ReturnType<typeof removeTodo>
  | ReturnType<typeof toggleTodo>
  | ReturnType<typeof dismissTodo>
  | ReturnType<typeof updateTodo>
  | ReturnType<typeof updateTodoMeta>
  | ReturnType<typeof completeInstance>
  | ReturnType<typeof completeTask>
  | ReturnType<typeof completeRepeatInstance>
  | ReturnType<typeof uncompleteRepeatInstance>
  | ReturnType<typeof moveTodo>;
