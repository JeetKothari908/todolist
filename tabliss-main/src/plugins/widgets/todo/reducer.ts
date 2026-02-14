import { Action } from "./actions";

type Todo = {
  id: string;
  contents: string;
  completed: boolean;
  dismissed?: boolean;
  dueDate?: string;
  repeat?: Repeat;
  parentId?: string;
};

export type State = Todo[];

export type Repeat =
  | { type: "daily" }
  | { type: "weekly"; days?: number[] }
  | { type: "custom"; days: number[] };

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat(action.data);

    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.data.id);

    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.data.id
          ? { ...todo, completed: !todo.completed, dismissed: false }
          : todo,
      );

    case "DISMISS_TODO":
      return state.map((todo) =>
        todo.id === action.data.id
          ? { ...todo, dismissed: true }
          : todo,
      );

    case "UPDATE_TODO":
      return state.map((todo) =>
        todo.id === action.data.id
          ? { ...todo, contents: action.data.contents }
          : todo,
      );

    case "UPDATE_TODO_META":
      return state.map((todo) =>
        todo.id === action.data.id
          ? {
              ...todo,
              dueDate: action.data.dueDate,
              repeat: action.data.repeat,
            }
          : todo,
      );

    case "COMPLETE_INSTANCE":
      return state.map((todo) =>
        todo.id === action.data.id
          ? { ...todo, completed: true }
          : todo,
      );

    case "COMPLETE_TASK":
      return state.filter((todo) => todo.id !== action.data.id);

    case "COMPLETE_REPEAT_INSTANCE": {
      const parent = state.find((todo) => todo.id === action.data.parentId);
      if (!parent) return state;
      const instance = {
        id: action.data.instanceId,
        contents: parent.contents,
        completed: true,
        dueDate: action.data.instanceDueDate,
        repeat: parent.repeat,
        parentId: action.data.parentId,
      };
      return state
        .map((todo) =>
          todo.id === action.data.parentId
            ? { ...todo, dueDate: action.data.nextDueDate }
            : todo,
        )
        .concat(instance);
    }

    case "UNCOMPLETE_REPEAT_INSTANCE": {
      // Remove the completed instance
      const filtered = state.filter(
        (todo) => todo.id !== action.data.instanceId,
      );
      // Only roll back parent's dueDate if the instance's date is earlier
      return filtered.map((todo) => {
        if (todo.id !== action.data.parentId) return todo;
        const instanceDate = action.data.instanceDueDate;
        if (
          instanceDate &&
          (!todo.dueDate || instanceDate < todo.dueDate)
        ) {
          return { ...todo, dueDate: instanceDate };
        }
        return todo;
      });
    }

    default:
      throw new Error("Unknown action");
  }
}
