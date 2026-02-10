import React, { FC, useEffect, useMemo, useState } from "react";

import { useSavedReducer } from "../../../hooks";
import { Icon, RemoveIcon } from "../../../views/shared";
import {
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo,
  updateTodoMeta,
} from "../todo/actions";
import { reducer, Repeat, State } from "../todo/reducer";
import { defaultData, Props } from "../todo/types";
import "./TodoPlus.sass";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const TodoPlus: FC<Props> = ({ data = defaultData, setData }) => {
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [remainingMenuOpen, setRemainingMenuOpen] = useState(false);
  const [todayMenuOpen, setTodayMenuOpen] = useState(false);
  const [itemMenuId, setItemMenuId] = useState<string | null>(null);
  const [draftItemMeta, setDraftItemMeta] = useState<{
    id: string;
    dueDate?: string;
    repeat?: Repeat;
  } | null>(null);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [repeatType, setRepeatType] = useState<
    "none" | "daily" | "weekly" | "custom"
  >("none");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [todayOpen, setTodayOpen] = useState(true);
  const [remainingOpen, setRemainingOpen] = useState(true);

  const repeatEqual = (a?: Repeat, b?: Repeat) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.type !== b.type) return false;
    if (a.type === "custom" && b.type === "custom") {
      const aDays = [...(a.days ?? [])].sort();
      const bDays = [...(b.days ?? [])].sort();
      return aDays.length === bDays.length && aDays.every((d, i) => d === bDays[i]);
    }
    return true;
  };

  const commitDraftItemMeta = () => {
    if (!draftItemMeta) return;
    const current = itemById.get(draftItemMeta.id);
    if (!current) {
      setDraftItemMeta(null);
      return;
    }
    if (
      current.dueDate !== draftItemMeta.dueDate ||
      !repeatEqual(current.repeat, draftItemMeta.repeat)
    ) {
      dispatch(
        updateTodoMeta(draftItemMeta.id, {
          dueDate: draftItemMeta.dueDate,
          repeat: draftItemMeta.repeat,
        }),
      );
    }
    setDraftItemMeta(null);
  };

  const closeAllMenus = () => {
    commitDraftItemMeta();
    if (menuOpen && input.trim()) {
      submitCurrentTask();
    }
    setMenuOpen(false);
    setRemainingMenuOpen(false);
    setTodayMenuOpen(false);
    setItemMenuId(null);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(".list-menu") ||
        target.closest(".menu") ||
        target.closest(".item-popover") ||
        target.closest(".section-menu") ||
        target.closest(".item-menu") ||
        target.closest(".menu-toggle") ||
        target.closest(".due-view-menu")
      ) {
        return;
      }
      closeAllMenus();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const setItems = (items: State) => setData({ ...data, items });
  const dispatch = useSavedReducer(reducer, data.items, setItems);

  const items = data.items;
  const today = new Date();
  const todayYmd = getYmd(today);
  const todayDay = today.getDay();

  const repeat: Repeat | undefined = useMemo(() => {
    if (repeatType === "daily") return { type: "daily" };
    if (repeatType === "weekly") {
      return customDays.length ? { type: "weekly", days: customDays } : { type: "weekly" };
    }
    if (repeatType === "custom") {
      const days = [...customDays].sort((a, b) => a - b);
      return days.length > 0 ? { type: "custom", days } : undefined;
    }
    return undefined;
  }, [repeatType, customDays]);

  function submitCurrentTask() {
    const trimmed = input.trim();
    if (!trimmed) return;
    dispatch(addTodo(trimmed, { dueDate, repeat }));
    setInput("");
    setDueDate(undefined);
    setRepeatType("none");
    setCustomDays([]);
  }

  const handleAdd = () => {
    submitCurrentTask();
    closeAllMenus();
  };

  const handleAddWithDueDate = (date: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      setDueDate(date);
      return;
    }
    dispatch(addTodo(trimmed, { dueDate: date, repeat }));
    setInput("");
    setDueDate(undefined);
    setRepeatType("none");
    setCustomDays([]);
    closeAllMenus();
  };

  const showMenuToggle = inputFocused || input.trim().length > 0;

  const formatDueDate = (date?: string) => {
    if (!date) return null;
    const parsed = parseDate(date);
    if (!parsed || Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const formatRepeat = (value?: Repeat) => {
    if (!value) return null;
    if (value.type === "daily") return "Daily";
    if (value.type === "weekly") return "Weekly";
    if (value.type === "custom") {
      const days =
        value.days?.length > 0
          ? value.days.map((day) => dayLabels[day]).join(", ")
          : "";
      return days ? days : "Custom";
    }
    return null;
  };

  const getRepeatDays = (item: State[number]) => {
    if (!item.repeat) return null;
    if (item.repeat.type === "daily") return [0, 1, 2, 3, 4, 5, 6];
    if (item.repeat.type === "custom") return item.repeat.days ?? [];
    if (item.repeat.type === "weekly") {
      const parsed = parseDate(item.dueDate);
      return [parsed ? parsed.getDay() : todayDay];
    }
    return null;
  };

  const isDueToday = (item: State[number]) => {
    if (item.dueDate && item.dueDate === todayYmd) return true;

    const repeatDays = getRepeatDays(item);
    if (!repeatDays) return false;

    if (item.dueDate) {
      const start = parseDate(item.dueDate);
      if (start && start > today) return false;
    }

    return repeatDays.includes(todayDay);
  };

  const dueToday = items.filter((item) => isDueToday(item));
  const remaining = items.filter((item) => !isDueToday(item));
  const dueList = dueToday;
  const dueLabel = "Due Today";
  const dueOpen = todayOpen;
  const setDueOpen = setTodayOpen;
  const dueMenuOpen = todayMenuOpen;
  const setDueMenuOpen = setTodayMenuOpen;

  const removeCompleted = (list: State) => {
    list.filter((item) => item.completed).forEach((item) => {
      dispatch(removeTodo(item.id));
    });
  };

  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );

  const renderRepeatMenu = (
    currentRepeat: Repeat | undefined,
    onRepeatChange: (next?: Repeat) => void,
    currentDueDate?: string,
    onDueDateChange?: (next?: string) => void,
    onClose?: (next?: { dueDate?: string; repeat?: Repeat }) => void,
  ) => (
    <div className="menu">
      <div className="menu-row">
        <div className="menu-row-label">
          <span>Due date</span>
          {currentDueDate && (
            <span className="menu-row-value">
              {formatDueDate(currentDueDate)}
            </span>
          )}
        </div>
        <label className="calendar-button">
          <Icon name="calendar" />
          <input
            type="date"
            value={currentDueDate ?? ""}
            onChange={(event) => {
              const nextDueDate = event.target.value || undefined;
              onDueDateChange?.(nextDueDate);
              onClose?.({ dueDate: nextDueDate, repeat: currentRepeat });
            }}
          />
        </label>
      </div>

      <div className="repeat">
        <span>Repeat</span>
        <div className="repeat-options">
          {["none", "daily", "weekly", "custom"].map((option) => (
            <button
              key={option}
              className={
                (currentRepeat?.type ?? "none") === option ? "active" : ""
              }
              onClick={() => {
                const nextRepeat =
                  option === "none"
                    ? undefined
                    : option === "daily"
                      ? { type: "daily" }
                      : option === "weekly"
                        ? {
                            type: "weekly",
                            days:
                              currentRepeat?.type === "weekly"
                                ? currentRepeat.days
                                : currentRepeat?.type === "custom"
                                  ? currentRepeat.days
                                  : [todayDay],
                          }
                        : {
                            type: "custom",
                            days:
                              currentRepeat?.type === "custom"
                                ? currentRepeat.days
                                : [],
                          };
                onRepeatChange(nextRepeat);
                if (option === "daily" || option === "none") {
                  onClose?.({ dueDate: currentDueDate, repeat: nextRepeat });
                }
              }}
            >
              {option === "none"
                ? "None"
                : option === "daily"
                  ? "Daily"
                  : option === "weekly"
                    ? "Weekly"
                    : "Custom"}
            </button>
          ))}
        </div>

        {((currentRepeat?.type ?? "none") === "custom" ||
          (currentRepeat?.type ?? "none") === "weekly") && (
          <div className="custom-days">
            {dayLabels.map((label, index) => {
              const isWeekly = (currentRepeat?.type ?? "none") === "weekly";
              const days =
                currentRepeat?.type === "custom"
                  ? currentRepeat.days
                  : currentRepeat?.type === "weekly"
                    ? currentRepeat.days ?? []
                    : [];
              const active = days.includes(index);
              return (
                <button
                  key={label}
                  className={active ? "active" : ""}
                  onClick={() => {
                    if (isWeekly) {
                      const nextRepeat = { type: "weekly", days: [index] };
                      onRepeatChange(nextRepeat);
                      onClose?.({ dueDate: currentDueDate, repeat: nextRepeat });
                      return;
                    }
                    onRepeatChange({
                      type: "custom",
                      days: active
                        ? days.filter((d: number) => d !== index)
                        : days.concat(index),
                    });
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderItems = (
    list: State,
    options: { showDue: boolean; showRepeat: boolean } = {
      showDue: true,
      showRepeat: true,
    },
  ) =>
    list.map((item, index) => {
      const openUp = index >= list.length - 1;
      return (
        <div
          key={item.id}
          className={`item${item.completed ? " completed" : ""}`}
        >
        <button
          className="check"
          aria-label="Toggle task"
          onClick={() => dispatch(toggleTodo(item.id))}
        >
          {item.completed ? <Icon name="check" size={14} /> : null}
        </button>

        <div className="content">
          <div className="content-row">
            <span
              className="text"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(event) =>
                dispatch(updateTodo(item.id, event.currentTarget.innerText))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  (event.currentTarget as HTMLElement).blur();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  event.currentTarget.innerText = item.contents;
                  (event.currentTarget as HTMLElement).blur();
                }
              }}
            >
              {item.contents}
            </span>
            {item.completed && (
              <span className="completed-icon">
                <Icon name="x" size={12} />
              </span>
            )}

            {((options.showDue && item.dueDate) ||
              (options.showRepeat && item.repeat)) && (
              <div className="meta inline">
                {options.showDue && item.dueDate && (
                  <span>{formatDueDate(item.dueDate)}</span>
                )}
                {options.showRepeat && item.repeat && (
                  <span>{formatRepeat(item.repeat)}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          className="item-menu"
          aria-label="Task options"
          onClick={() => {
            closeAllMenus();
            setDraftItemMeta({
              id: item.id,
              dueDate: item.dueDate,
              repeat: item.repeat,
            });
            setItemMenuId((prev) => (prev === item.id ? null : item.id));
          }}
        >
          <Icon name="more-horizontal" />
        </button>

        {itemMenuId === item.id && (
          <div className={`item-popover${openUp ? " up" : " down"}`}>
            {renderRepeatMenu(
              draftItemMeta?.repeat ?? item.repeat,
              (next) =>
                setDraftItemMeta({
                  id: item.id,
                  dueDate: draftItemMeta?.dueDate ?? item.dueDate,
                  repeat: next,
                }),
              draftItemMeta?.dueDate ?? item.dueDate,
              (next) =>
                setDraftItemMeta({
                  id: item.id,
                  dueDate: next,
                  repeat: draftItemMeta?.repeat ?? item.repeat,
                }),
              (next) => {
                const current = itemById.get(item.id);
                if (!current) {
                  setDraftItemMeta(null);
                  setItemMenuId(null);
                  return;
                }
                const nextDueDate =
                  next?.dueDate ??
                  draftItemMeta?.dueDate ??
                  item.dueDate;
                const nextRepeat =
                  next?.repeat ??
                  draftItemMeta?.repeat ??
                  item.repeat;
                if (
                  current.dueDate !== nextDueDate ||
                  !repeatEqual(current.repeat, nextRepeat)
                ) {
                  dispatch(
                    updateTodoMeta(item.id, {
                      dueDate: nextDueDate,
                      repeat: nextRepeat,
                    }),
                  );
                }
                setDraftItemMeta(null);
                setItemMenuId(null);
              },
            )}
          </div>
        )}

        <button
          className="delete"
          aria-label="Delete task"
          onClick={() => dispatch(removeTodo(item.id))}
        >
          <RemoveIcon />
        </button>
        </div>
      );
    });

  const listHasOpenItemMenu = (list: State) =>
    itemMenuId ? list.some((item) => item.id === itemMenuId) : false;

  return (
    <div className="TodoPlus">
      <div className="panel">
        <div className="header">
          <div className="section-title">
            <button
              className="section-toggle"
              onClick={() => setDueOpen(!dueOpen)}
              aria-label="Collapse list"
            >
              <span className="section-label">{dueLabel}</span>
              <Icon name={dueOpen ? "chevron-down" : "chevron-right"} />
            </button>
            <button
              className="section-menu"
              onClick={() => {
                closeAllMenus();
                setDueMenuOpen(true);
              }}
              aria-label="List options"
            >
              <Icon name="more-horizontal" />
            </button>
          </div>
        </div>
        <div
          className={`list ${
            dueMenuOpen || listHasOpenItemMenu(dueList) ? "menu-open" : ""
          }`}
        >
          {dueMenuOpen && (
            <div className="list-menu">
              <button
                onClick={() => {
                  setDueMenuOpen(false);
                  closeAllMenus();
                }}
              >
                Settings
              </button>
              <button
                onClick={() => {
                  removeCompleted(dueList);
                  closeAllMenus();
                }}
              >
                Delete completed items
              </button>
            </div>
          )}
          {dueOpen && (
            <>
              {dueList.length ? (
                renderItems(dueList, {
                  showDue: true,
                  showRepeat: true,
                })
              ) : (
                <div className="empty">No tasks due today</div>
              )}
            </>
          )}
        </div>

      </div>

      <div className="panel">
        <div className="header">
          <div className="section-title">
            <button
              className="section-toggle"
              onClick={() => setRemainingOpen(!remainingOpen)}
              aria-label="Collapse list"
            >
              <span className="section-label">Inbox</span>
              <Icon name={remainingOpen ? "chevron-down" : "chevron-right"} />
            </button>
            <button
              className="section-menu"
              onClick={() => {
                closeAllMenus();
                setRemainingMenuOpen(true);
              }}
              aria-label="List options"
            >
              <Icon name="more-horizontal" />
            </button>
          </div>
        </div>
        <div
          className={`list ${
            remainingMenuOpen || listHasOpenItemMenu(remaining)
              ? "menu-open"
              : ""
          }`}
        >
          {remainingMenuOpen && (
            <div className="list-menu">
              <button
                onClick={() => {
                  setRemainingMenuOpen(false);
                  closeAllMenus();
                }}
              >
                Settings
              </button>
              <button
                onClick={() => {
                  removeCompleted(remaining);
                  closeAllMenus();
                }}
              >
                Delete completed items
              </button>
            </div>
          )}
          {remainingOpen && (
            <>
              {remaining.length ? (
                renderItems(remaining, { showDue: true, showRepeat: true })
              ) : (
                <div className="empty">No remaining tasks</div>
              )}
            </>
          )}
        </div>

        <div className="footer">
          <div className="composer">
            <input
              placeholder="New Task"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAdd();
                }
              }}
            />

            {showMenuToggle && (
              <button
                className="due-today"
                onClick={() => handleAddWithDueDate(getYmd(new Date()))}
                aria-label="Set due today"
              >
                Due Today
              </button>
            )}
            {showMenuToggle && (
              <button
                className={`menu-toggle${menuOpen ? " open" : ""}`}
                onClick={() => {
                  closeAllMenus();
                  setMenuOpen(true);
                }}
                aria-label="Task options"
              >
                <Icon name="more-horizontal" />
              </button>
            )}
          </div>

          {menuOpen &&
            renderRepeatMenu(
              repeatType === "none"
                ? undefined
                : repeatType === "daily"
                  ? { type: "daily" }
                  : repeatType === "weekly"
                    ? { type: "weekly", days: customDays }
                    : { type: "custom", days: customDays },
              (next) => {
                if (!next) {
                  setRepeatType("none");
                  setCustomDays([]);
                } else if (next.type === "daily") {
                  setRepeatType("daily");
                  setCustomDays([]);
                } else if (next.type === "weekly") {
                  setRepeatType("weekly");
                  setCustomDays(next.days ?? []);
                } else {
                  setRepeatType("custom");
                  setCustomDays(next.days);
                }
              },
              dueDate,
              (next) => setDueDate(next),
              (next) => {
                if (next?.dueDate) {
                  handleAddWithDueDate(next.dueDate);
                } else {
                  handleAdd();
                }
              },
            )}
        </div>
      </div>
    </div>
  );
};

export default TodoPlus;
