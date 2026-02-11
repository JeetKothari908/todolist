import React, { FC } from "react";

import { State } from "./reducer";
import TodoItem from "./TodoItem";
import "./TodoList.sass";

interface Props {
  items: State;
  show?: number;
  onToggle(id: string): void;
  onCompleteInstance(id: string): void;
  onCompleteTask(id: string): void;
  onUpdate(id: string, contents: string): void;
  onRemove(id: string): void;
}

const TodoList: FC<Props> = ({
  items,
  onToggle,
  onCompleteInstance,
  onCompleteTask,
  onUpdate,
  onRemove,
  show = 0,
}) => (
  <div className="TodoList">
    {items.slice(-show).map((item) => (
      <TodoItem
        key={item.id}
        item={item}
        onToggle={() => onToggle(item.id)}
        onCompleteInstance={() => onCompleteInstance(item.id)}
        onCompleteTask={() => onCompleteTask(item.id)}
        onUpdate={(contents) => onUpdate(item.id, contents)}
        onDelete={() => onRemove(item.id)}
      />
    ))}
  </div>
);

export default TodoList;
