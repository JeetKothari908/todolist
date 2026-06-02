import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  useEffect,
  useReducer,
  useRef,
} from "react";

export function useSavedReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  save: (state: ReducerState<R>) => void,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const [state, dispatch] = useReducer(reducer, initialState);

  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    saveRef.current(state);
  }, [state]);

  return [state, dispatch];
}
