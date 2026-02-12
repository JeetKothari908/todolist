import { Action } from "./actions";

type Todo = {
  id: string;
  contents: string;
  completed: boolean;
  finished?: boolean;
  dueDate?: string;
  repeat?: Repeat;
  parentId?: string;
  pendingDates?: string[];
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
          ? { ...todo, completed: !todo.completed }
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
              pendingDates: action.data.pendingDates,
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

    case "FINISH_TODO":
      return state.map((todo) =>
        todo.id === action.data.id
          ? { ...todo, completed: true, finished: true }
          : todo,
      );

    case "UNFINISH_TODO":
      return state.map((todo) =>
        todo.id === action.data.id
          ? { ...todo, completed: false, finished: false }
          : todo,
      );

    default:
      throw new Error("Unknown action");
  }
}
