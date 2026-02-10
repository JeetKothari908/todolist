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

const startOfWeek = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const diff = (day + 6) % 7; // Monday start
  start.setDate(start.getDate() - diff);
  return start;
};

const endOfWeek = (date: Date) => {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

const TodoPlus: FC<Props> = ({ data = defaultData, setData }) => {
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [remainingMenuOpen, setRemainingMenuOpen] = useState(false);
  const [weekMenuOpen, setWeekMenuOpen] = useState(false);
  const [todayMenuOpen, setTodayMenuOpen] = useState(false);
  const [itemMenuId, setItemMenuId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [repeatType, setRepeatType] = useState<
    "none" | "daily" | "weekly" | "custom"
  >("none");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [todayOpen, setTodayOpen] = useState(true);
  const [weekOpen, setWeekOpen] = useState(true);
  const [remainingOpen, setRemainingOpen] = useState(true);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setRemainingMenuOpen(false);
    setWeekMenuOpen(false);
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
        target.closest(".menu-toggle")
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
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const repeat: Repeat | undefined = useMemo(() => {
    if (repeatType === "daily") return { type: "daily" };
    if (repeatType === "weekly") return { type: "weekly" };
    if (repeatType === "custom") {
      const days = [...customDays].sort((a, b) => a - b);
      return days.length > 0 ? { type: "custom", days } : undefined;
    }
    return undefined;
  }, [repeatType, customDays]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    dispatch(addTodo(trimmed, { dueDate, repeat }));
    setInput("");
    setDueDate(undefined);
    setRepeatType("none");
    setCustomDays([]);
    setMenuOpen(false);
    setRemainingMenuOpen(false);
    setWeekMenuOpen(false);
    setTodayMenuOpen(false);
    setItemMenuId(null);
  };

  const showMenuToggle = inputFocused || input.trim().length > 0;

  const formatDueDate = (date?: string) => {
    if (!date) return null;
    const parsed = parseDate(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const formatRepeat = (value?: Repeat) => {
    if (!value) return null;
    if (value.type === "daily") return "Repeats daily";
    if (value.type === "weekly") return "Repeats weekly";
    if (value.type === "custom") {
      const days =
        value.days?.length > 0
          ? value.days.map((day) => dayLabels[day]).join(", ")
          : "";
      return days ? `Repeats ${days}` : "Repeats custom";
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

  const getUpcomingWeekDaysFrom = (start: Date) => {
    const days: number[] = [];
    const cursor = new Date(start);
    while (cursor <= weekEnd) {
      days.push(cursor.getDay());
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  };

  const upcomingWeekDays = getUpcomingWeekDaysFrom(tomorrow);

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

  const isDueThisWeek = (item: State[number]) => {
    if (item.dueDate) {
      const parsed = parseDate(item.dueDate);
      if (!parsed) return false;
      if (!item.repeat) {
        return parsed >= tomorrow && parsed <= weekEnd;
      }
      if (parsed > weekEnd) return false;
      if (parsed > today) {
        const days = getUpcomingWeekDaysFrom(parsed);
        const repeatDays = getRepeatDays(item) ?? [];
        return repeatDays.some((day) => days.includes(day));
      }
    }

    const repeatDays = getRepeatDays(item);
    if (!repeatDays || repeatDays.length === 0) return false;
    return repeatDays.some((day) => upcomingWeekDays.includes(day));
  };

  const dueToday = items.filter((item) => isDueToday(item));
  const dueThisWeek = items.filter(
    (item) => !isDueToday(item) && isDueThisWeek(item),
  );
  const remaining = items.filter(
    (item) => !isDueToday(item) && !isDueThisWeek(item),
  );

  const removeCompleted = (list: State) => {
    list.filter((item) => item.completed).forEach((item) => {
      dispatch(removeTodo(item.id));
    });
  };

  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );

  const setItemMeta = (
    id: string,
    next: { dueDate?: string; repeat?: Repeat },
    close = false,
  ) => {
    const current = itemById.get(id);
    if (!current) return;
    dispatch(
      updateTodoMeta(id, {
        dueDate: next.dueDate,
        repeat: next.repeat,
      }),
    );
    if (close) setItemMenuId(null);
  };

  const renderRepeatMenu = (
    currentRepeat: Repeat | undefined,
    onRepeatChange: (next?: Repeat) => void,
    currentDueDate?: string,
    onDueDateChange?: (next?: string) => void,
    onClose?: () => void,
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
              onDueDateChange?.(event.target.value || undefined);
              onClose?.();
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
                onRepeatChange(
                  option === "none"
                    ? undefined
                    : option === "daily"
                      ? { type: "daily" }
                      : option === "weekly"
                        ? { type: "weekly" }
                        : {
                            type: "custom",
                            days:
                              currentRepeat?.type === "custom"
                                ? currentRepeat.days
                                : [],
                          },
                );
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

        {(currentRepeat?.type ?? "none") === "custom" && (
          <div className="custom-days">
            {dayLabels.map((label, index) => {
              const days =
                currentRepeat?.type === "custom" ? currentRepeat.days : [];
              const active = days.includes(index);
              return (
                <button
                  key={label}
                  className={active ? "active" : ""}
                  onClick={() => {
                    onRepeatChange({
                      type: "custom",
                      days: active
                        ? days.filter((d) => d !== index)
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

  const renderItems = (list: State) =>
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

            {(item.dueDate || item.repeat) && (
              <div className="meta inline">
                {item.dueDate && <span>Due {formatDueDate(item.dueDate)}</span>}
                {item.repeat && <span>{formatRepeat(item.repeat)}</span>}
              </div>
            )}
          </div>
        </div>

        <button
          className="item-menu"
          aria-label="Task options"
          onClick={() => {
            closeAllMenus();
            setItemMenuId((prev) => (prev === item.id ? null : item.id));
          }}
        >
          <Icon name="more-horizontal" />
        </button>

        {itemMenuId === item.id && (
          <div className={`item-popover${openUp ? " up" : " down"}`}>
            {renderRepeatMenu(
              item.repeat,
              (next) =>
                setItemMeta(item.id, { dueDate: item.dueDate, repeat: next }),
              item.dueDate,
              (next) =>
                setItemMeta(
                  item.id,
                  { dueDate: next, repeat: item.repeat },
                  true,
                ),
              () => setItemMenuId(null),
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
              onClick={() => setWeekOpen(!weekOpen)}
              aria-label="Collapse list"
            >
              <span className="section-label">Tasks due This Week</span>
              <Icon name={weekOpen ? "chevron-down" : "chevron-right"} />
            </button>
            <button
              className="section-menu"
              onClick={() => {
                closeAllMenus();
                setWeekMenuOpen(true);
              }}
              aria-label="List options"
            >
              <Icon name="more-horizontal" />
            </button>
          </div>
        </div>
        <div
          className={`list ${
            weekMenuOpen || listHasOpenItemMenu(dueThisWeek)
              ? "menu-open"
              : ""
          }`}
        >
          {weekMenuOpen && (
            <div className="list-menu">
              <button onClick={() => setWeekMenuOpen(false)}>Settings</button>
              <button onClick={() => removeCompleted(dueThisWeek)}>
                Delete completed items
              </button>
            </div>
          )}
          {weekOpen && (
            <>
              {dueThisWeek.length ? renderItems(dueThisWeek) : (
                <div className="empty">No tasks due this week</div>
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
              onClick={() => setTodayOpen(!todayOpen)}
              aria-label="Collapse list"
            >
              <span className="section-label">Tasks due Today</span>
              <Icon name={todayOpen ? "chevron-down" : "chevron-right"} />
            </button>
            <button
              className="section-menu"
              onClick={() => {
                closeAllMenus();
                setTodayMenuOpen(true);
              }}
              aria-label="List options"
            >
              <Icon name="more-horizontal" />
            </button>
          </div>
        </div>
        <div
          className={`list ${
            todayMenuOpen || listHasOpenItemMenu(dueToday) ? "menu-open" : ""
          }`}
        >
          {todayMenuOpen && (
            <div className="list-menu">
              <button onClick={() => setTodayMenuOpen(false)}>Settings</button>
              <button onClick={() => removeCompleted(dueToday)}>
                Delete completed items
              </button>
            </div>
          )}
          {todayOpen && (
            <>
              {dueToday.length ? renderItems(dueToday) : (
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
              <button onClick={() => setRemainingMenuOpen(false)}>Settings</button>
              <button onClick={() => removeCompleted(remaining)}>
                Delete completed items
              </button>
            </div>
          )}
          {remainingOpen && (
            <>
              {remaining.length ? renderItems(remaining) : (
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
                    ? { type: "weekly" }
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
                  setCustomDays([]);
                } else {
                  setRepeatType("custom");
                  setCustomDays(next.days);
                }
              },
              dueDate,
              (next) => setDueDate(next),
            )}
        </div>
      </div>
    </div>
  );
};

export default TodoPlus;
