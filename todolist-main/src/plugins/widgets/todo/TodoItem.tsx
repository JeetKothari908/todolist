import React, { FC, useLayoutEffect, useRef, useState } from "react";

import { useKeyPress } from "../../../hooks";
import { Icon, RemoveIcon } from "../../../views/shared";
import { State } from "./reducer";
import "./TodoItem.sass";

interface Props {
  item: State[number];
  onToggle(): void;
  onCompleteInstance(): void;
  onCompleteTask(): void;
  onUpdate(contents: string): void;
  onDelete(): void;
}

const TodoItem: FC<Props> = ({ item, onDelete, onUpdate, onToggle, onCompleteInstance, onCompleteTask }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Flush any pending contentEditable text (since the action buttons don't necessarily
  // steal focus from the span, onBlur may not fire on its own).
  const commitPendingEdit = () => {
    if (ref.current && ref.current.innerText !== item.contents) {
      onUpdate(ref.current.innerText);
    }
  };

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.innerText = item.contents;

      if (item.contents === "") {
        ref.current.focus();
      }
    }
  }, [item.contents]);

  useKeyPress(
    (event) => {
      if (event.target === ref.current) {
        event.preventDefault();

        if (ref.current) {
          ref.current.blur();
        }
      }
    },
    ["Enter"],
    false,
  );

  useKeyPress(
    (event) => {
      if (event.target === ref.current) {
        event.preventDefault();

        if (ref.current) {
          // Reset contents on escape
          ref.current.innerText = item.contents;
          ref.current.blur();
        }
      }
    },
    ["Escape"],
    false,
  );

  return (
    <div className="TodoItem">
      <span
        ref={ref}
        contentEditable={true}
        onBlur={(event) => onUpdate(event.currentTarget.innerText)}
      />

      <div className="controls">
        <a
          onClick={() => {
            commitPendingEdit();
            if (item.repeat && !item.completed) {
              setShowMenu(true);
            } else {
              onToggle();
              setShowMenu(false);
            }
          }}
          className="complete"
        >
          <Icon name={item.completed ? "check-circle" : "circle"} />
        </a>

        {showMenu && item.repeat && !item.completed && (
          <div className="repeatMenu">
            <button
              onClick={() => {
                commitPendingEdit();
                onCompleteInstance();
                setShowMenu(false);
              }}
            >
              Completed This Instance
            </button>
            <button
              onClick={() => {
                commitPendingEdit();
                onCompleteTask();
                setShowMenu(false);
              }}
            >
              Complete Task
            </button>
          </div>
        )}

        <a onClick={onDelete} className="delete">
          <RemoveIcon />
        </a>
      </div>
    </div>
  );
};

export default TodoItem;
