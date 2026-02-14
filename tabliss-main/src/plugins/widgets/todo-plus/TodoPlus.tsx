import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { useSavedReducer } from "../../../hooks";
import { Icon, RemoveIcon } from "../../../views/shared";
import {
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo,
  updateTodoMeta,
  completeRepeatInstance,
  uncompleteRepeatInstance,
} from "../todo/actions";
import { reducer, Repeat, State } from "../todo/reducer";
import { defaultData, Props } from "../todo/types";
import { calculateCappedHeights } from "../../../hooks/calculateCappedHeights";
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

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const nextRepeatDate = (
  repeat: Repeat,
  dueDate: string | undefined,
  today: Date,
): Date | null => {
  const base = parseDate(dueDate) ?? today;
  if (repeat.type === "daily") return addDays(base, 1);

  const selectedDays =
    repeat.type === "custom"
      ? repeat.days
      : repeat.days && repeat.days.length
        ? repeat.days
        : [base.getDay()];

  if (!selectedDays.length) return null;
  for (let offset = 1; offset <= 7; offset += 1) {
    const candidate = addDays(base, offset);
    if (selectedDays.includes(candidate.getDay())) return candidate;
  }
  return null;
};

const firstRepeatDate = (repeat: Repeat, today: Date): Date | null => {
  if (repeat.type === "daily") return today;
  const selectedDays =
    repeat.type === "custom"
      ? repeat.days
      : repeat.days && repeat.days.length
        ? repeat.days
        : [today.getDay()];
  if (!selectedDays.length) return null;
  for (let offset = 0; offset <= 6; offset += 1) {
    const candidate = addDays(today, offset);
    if (selectedDays.includes(candidate.getDay())) return candidate;
  }
  return null;
};

const TodoPlus: FC<Props> = ({ data = defaultData, setData }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const duePanelRef = useRef<HTMLDivElement | null>(null);
  const dueListRef = useRef<HTMLDivElement | null>(null);
  const remainingPanelRef = useRef<HTMLDivElement | null>(null);
  const remainingListRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [remainingMenuOpen, setRemainingMenuOpen] = useState(false);
  const [dueListMenuOpen, setDueListMenuOpen] = useState(false);
  const [dueViewMenuOpen, setDueViewMenuOpen] = useState(false);
  const [dueView, setDueView] = useState<"today" | "finished">("today");
  const [completeMenuId, setCompleteMenuId] = useState<string | null>(null);
  const [itemMenuId, setItemMenuId] = useState<string | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<{ top: number; left: number; right: number; bottom: number } | null>(null);
  const [completeMenuAnchor, setCompleteMenuAnchor] = useState<{ top: number; left: number; right: number; bottom: number } | null>(null);
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
  const [dueOpen, setDueOpen] = useState(true);
  const [remainingOpen, setRemainingOpen] = useState(true);
  const [listCaps, setListCaps] = useState({ due: 220, remaining: 220 });
  const [cappedLists, setCappedLists] = useState({ due: false, remaining: false });
  const activeListRef = useRef(1); // 0 = due panel, 1 = remaining/inbox panel

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

  const normalizeRepeat = (repeat?: Repeat): Repeat | undefined => {
    if (!repeat) return undefined;
    if (repeat.type === "custom" && (!repeat.days || repeat.days.length === 0)) return undefined;
    return repeat;
  };

  const commitDraftItemMeta = () => {
    if (!draftItemMeta) return;
    const current = itemById.get(draftItemMeta.id);
    if (!current) {
      setDraftItemMeta(null);
      return;
    }
    const finalRepeat = normalizeRepeat(draftItemMeta.repeat);
    if (
      current.dueDate !== draftItemMeta.dueDate ||
      !repeatEqual(current.repeat, finalRepeat)
    ) {
      dispatch(
        updateTodoMeta(draftItemMeta.id, {
          dueDate: draftItemMeta.dueDate,
          repeat: finalRepeat,
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
    setDueListMenuOpen(false);
    setDueViewMenuOpen(false);
    setCompleteMenuId(null);
    setCompleteMenuAnchor(null);
    setItemMenuId(null);
    setPopoverAnchor(null);
  };

  const closeAllMenusRef = useRef(closeAllMenus);
  closeAllMenusRef.current = closeAllMenus;

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
        target.closest(".due-view-menu") ||
        target.closest(".complete-menu")
      ) {
        return;
      }
      closeAllMenusRef.current();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const setItems = (items: State) => setData({ ...data, items });
  const [items, dispatch] = useSavedReducer(reducer, data.items, setItems);
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
    activeListRef.current = dueDate === todayYmd ? 0 : 1;
    dispatch(addTodo(trimmed, { dueDate, repeat }));
    setInput("");
    setDueDate(undefined);
    setRepeatType("none");
    setCustomDays([]);
  }

  const submitTaskWithMeta = (meta?: { dueDate?: string; repeat?: Repeat }) => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    const finalDueDate = meta?.dueDate ?? dueDate;
    activeListRef.current = finalDueDate === todayYmd ? 0 : 1;
    dispatch(
      addTodo(trimmed, {
        dueDate: finalDueDate,
        repeat: meta?.repeat ?? repeat,
      }),
    );
    setInput("");
    setDueDate(undefined);
    setRepeatType("none");
    setCustomDays([]);
    return true;
  };

  const handleAdd = () => {
    submitTaskWithMeta();
    closeAllMenus();
  };

  const handleAddWithDueDate = (date: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      setDueDate(date);
      return;
    }
    submitTaskWithMeta({ dueDate: date });
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

  const getRepeatDerivedDueDate = (repeat?: Repeat) => {
    if (!repeat) return undefined;
    const firstDate = firstRepeatDate(repeat, today);
    return firstDate ? getYmd(firstDate) : undefined;
  };

  const getTaskDisplayDueDate = (item: State[number]) =>
    item.dueDate ?? (item.repeat ? getRepeatDerivedDueDate(item.repeat) : undefined);

  const getRepeatDays = (item: State[number]) => {
    if (!item.repeat) return null;
    if (item.repeat.type === "daily") return [0, 1, 2, 3, 4, 5, 6];
    if (item.repeat.type === "custom") return item.repeat.days ?? [];
    if (item.repeat.type === "weekly") {
      if (item.repeat.days && item.repeat.days.length) return item.repeat.days;
      const parsed = parseDate(item.dueDate);
      return parsed ? [parsed.getDay()] : [];
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

  const activeItems = items.filter((item) => !item.completed);
  const finished = items.filter((item) => item.completed);
  const dueToday = activeItems.filter((item) => isDueToday(item));
  const remaining = activeItems.filter((item) => !isDueToday(item));
  const remainingSorted = [...remaining].sort((a, b) => {
    const aDue = getTaskDisplayDueDate(a);
    const bDue = getTaskDisplayDueDate(b);
    if (!aDue && !bDue) return 0;
    if (!aDue) return -1;
    if (!bDue) return 1;
    return aDue.localeCompare(bDue);
  });
  const finishedSorted = [...finished].sort((a, b) => {
    const aDue = getTaskDisplayDueDate(a);
    const bDue = getTaskDisplayDueDate(b);
    if (!aDue && !bDue) return 0;
    if (!aDue) return -1;
    if (!bDue) return 1;
    return aDue.localeCompare(bDue);
  });
  const dueList = dueView === "today" ? dueToday : finishedSorted;
  const dueLabel = dueView === "today" ? "Due Today" : "Finished Tasks";

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
          {(currentDueDate || getRepeatDerivedDueDate(currentRepeat)) && (
            <span className="menu-row-value">
              {formatDueDate(currentDueDate ?? getRepeatDerivedDueDate(currentRepeat))}
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
          {(["none", "daily", "weekly", "custom"] as const).map((option) => (
            <button
              key={option}
              className={
                (currentRepeat?.type ?? "none") === option ? "active" : ""
              }
              onClick={() => {
                const nextRepeat: Repeat | undefined =
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
                if (
                  option === "custom" &&
                  !currentDueDate &&
                  nextRepeat &&
                  nextRepeat.type === "custom"
                ) {
                  // Repeat-derived due date is displayed independently from manual dueDate.
                }
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
                      const nextRepeat: Repeat = { type: "weekly", days: [index] };
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
    listIdx: number,
    options: { showDue: boolean; showRepeat: boolean } = {
      showDue: true,
      showRepeat: true,
    },
  ) =>
    list.map((item, index) => {
      const isDrafting = draftItemMeta?.id === item.id;
      const displayRepeat = isDrafting ? normalizeRepeat(draftItemMeta.repeat) : item.repeat;
      const displayDueDate = isDrafting
        ? (draftItemMeta.dueDate ?? (displayRepeat ? getRepeatDerivedDueDate(displayRepeat) : undefined))
        : getTaskDisplayDueDate(item);
      return (
        <div
          key={item.id}
          className={`item${item.completed ? " completed" : ""}`}
        >
        <button
          className="check"
          aria-label="Toggle task"
          onClick={(e) => {
            activeListRef.current = listIdx;
            if (item.completed) {
              if (item.parentId) {
                dispatch(uncompleteRepeatInstance(item.id, item.parentId, item.dueDate));
              } else {
                dispatch(toggleTodo(item.id));
              }
              return;
            }
            if (item.repeat) {
              closeAllMenus();
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setCompleteMenuAnchor({ top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom });
              setCompleteMenuId((prev) => (prev === item.id ? null : item.id));
              return;
            }
            dispatch(toggleTodo(item.id));
          }}
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

            {((options.showDue && displayDueDate) ||
              (options.showRepeat && displayRepeat)) && (
              <div className="meta inline">
                {options.showDue && displayDueDate && (
                  <span>{formatDueDate(displayDueDate)}</span>
                )}
                {options.showRepeat && displayRepeat && (
                  <span>{formatRepeat(displayRepeat)}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          className="item-menu"
          aria-label="Task options"
          onClick={(e) => {
            closeAllMenus();
            setDraftItemMeta({
              id: item.id,
              dueDate: item.dueDate,
              repeat: item.repeat,
            });
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setPopoverAnchor({ top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom });
            setItemMenuId((prev) => (prev === item.id ? null : item.id));
          }}
        >
          <Icon name="more-horizontal" />
        </button>

        {itemMenuId === item.id && popoverAnchor && (() => {
          // Max height of the repeat menu fully expanded (due row + repeat options + custom days + padding/gaps)
          const estimatedMenuHeight = 200;
          const spaceBelow = window.innerHeight - popoverAnchor.bottom - 8;
          const popoverUp = spaceBelow < estimatedMenuHeight && popoverAnchor.top > spaceBelow;
          return ReactDOM.createPortal(
          <div
            className={`TodoPlus-portal item-popover${popoverUp ? " up" : " down"}`}
            style={popoverUp
              ? { position: "fixed", bottom: `${window.innerHeight - popoverAnchor.top + 8}px`, right: `${window.innerWidth - popoverAnchor.right}px` }
              : { position: "fixed", top: `${popoverAnchor.bottom + 8}px`, right: `${window.innerWidth - popoverAnchor.right}px` }
            }
          >
            {renderRepeatMenu(
              draftItemMeta?.repeat ?? item.repeat,
              (next) =>
                setDraftItemMeta((prev) => ({
                  id: item.id,
                  dueDate:
                    prev && prev.id === item.id
                      ? prev.dueDate
                      : item.dueDate,
                  repeat: next,
                })),
              draftItemMeta?.id === item.id
                ? draftItemMeta?.dueDate
                : item.dueDate,
              (next) =>
                setDraftItemMeta((prev) => ({
                  id: item.id,
                  dueDate: next,
                  repeat:
                    prev && prev.id === item.id
                      ? prev.repeat
                      : item.repeat,
                })),
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
                const nextRepeat = normalizeRepeat(
                  next?.repeat ??
                  draftItemMeta?.repeat ??
                  item.repeat,
                );
                if (
                  current.dueDate !== nextDueDate ||
                  !repeatEqual(current.repeat, nextRepeat)
                ) {
                  activeListRef.current = listIdx;
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
          </div>,
          document.body,
        );
        })()}

        {completeMenuId === item.id && completeMenuAnchor && (() => {
          const estimatedCompleteHeight = 80;
          const spaceBelow = window.innerHeight - completeMenuAnchor.bottom - 8;
          const completeUp = spaceBelow < estimatedCompleteHeight && completeMenuAnchor.top > spaceBelow;
          return ReactDOM.createPortal(
          <div
            className={`TodoPlus-portal complete-menu${completeUp ? " up" : " down"}`}
            style={completeUp
              ? { position: "fixed", bottom: `${window.innerHeight - completeMenuAnchor.top + 8}px`, left: `${completeMenuAnchor.left}px` }
              : { position: "fixed", top: `${completeMenuAnchor.bottom + 8}px`, left: `${completeMenuAnchor.left}px` }
            }
          >
            <button
              onClick={() => {
                activeListRef.current = listIdx;
                if (!item.repeat) {
                  setCompleteMenuId(null);
                  return;
                }
                const currentDueDate = item.dueDate ?? getRepeatDerivedDueDate(item.repeat);
                // Collect dates that already have completed sibling instances
                const siblingDates = new Set(
                  items
                    .filter((i) => i.parentId === item.id && i.completed && i.dueDate)
                    .map((i) => i.dueDate!),
                );
                // Advance past dates that already have a completed instance
                let next = nextRepeatDate(
                  item.repeat,
                  currentDueDate,
                  today,
                );
                let safety = 0;
                while (next && siblingDates.has(getYmd(next)) && safety < 365) {
                  next = nextRepeatDate(item.repeat, getYmd(next), today);
                  safety += 1;
                }
                if (next) {
                  dispatch(
                    completeRepeatInstance(
                      item.id,
                      currentDueDate,
                      getYmd(next),
                    ),
                  );
                }
                setCompleteMenuId(null);
              }}
            >
              Completed This Instance
            </button>
            <button
              onClick={() => {
                activeListRef.current = listIdx;
                dispatch(toggleTodo(item.id));
                setCompleteMenuId(null);
              }}
            >
              Complete Task
            </button>
          </div>,
          document.body,
        );
        })()}

        <button
          className="delete"
          aria-label="Delete task"
          onClick={() => {
            activeListRef.current = listIdx;
            dispatch(removeTodo(item.id));
          }}
        >
          <RemoveIcon />
        </button>
        </div>
      );
    });

  // Panel-level elevation (z-index)
  const duePanelOpen =
    dueViewMenuOpen || dueListMenuOpen;
  const remainingPanelOpen =
    menuOpen || remainingMenuOpen;

  useEffect(() => {
    const recalc = () => {
      if (
        !rootRef.current ||
        !duePanelRef.current ||
        !dueListRef.current ||
        !remainingPanelRef.current ||
        !remainingListRef.current
      ) {
        return;
      }

      const viewportHeight = window.innerHeight;
      const verticalPadding = Math.max(40, Math.round(viewportHeight * 0.12));

      // The widget is vertically centered via CSS transform, so the
      // total widget height must not exceed the viewport.  Base
      // available height on the viewport minus padding.
      const availableHeight = Math.max(0, viewportHeight - verticalPadding);

      const dueFixed =
        duePanelRef.current.offsetHeight - dueListRef.current.offsetHeight;
      const remainingFixed =
        remainingPanelRef.current.offsetHeight - remainingListRef.current.offsetHeight;
      const rootStyles = getComputedStyle(rootRef.current);
      const gapFromCss = Number.parseFloat(rootStyles.rowGap || rootStyles.gap || "0");
      const panelGap = Number.isFinite(gapFromCss) && gapFromCss > 0
        ? gapFromCss
        : Math.max(8, Math.round(viewportHeight * 0.012));
      const panelCount = 2;
      const free = Math.max(
        0,
        availableHeight - dueFixed - remainingFixed - panelGap * (panelCount - 1),
      );

      // ── Height allocation ─────────────────────────────────────
      // First pass: Due gets what it needs up to half the free space.
      const dueNeed = dueOpen ? dueListRef.current.scrollHeight : 0;
      const remainingNeed = remainingOpen ? remainingListRef.current.scrollHeight : 0;
      const maxDueShare = Math.floor(free / 2);
      let dueCap = Math.min(dueNeed, maxDueShare);
      let remainingCap = Math.max(0, free - dueCap);

      // Second pass: if Inbox doesn't need all its space, give the
      // surplus back to the due panel so it can grow when switching
      // between views with different task counts.
      if (remainingNeed < remainingCap) {
        const surplus = remainingCap - remainingNeed;
        dueCap = Math.min(dueNeed, dueCap + surplus);
        remainingCap = Math.max(0, free - dueCap);
      }

      const newCappedLists = {
        due: dueNeed > dueCap,
        remaining: remainingOpen
          ? remainingListRef.current.scrollHeight > remainingCap
          : false,
      };

      setListCaps((prev) =>
        prev.due === dueCap && prev.remaining === remainingCap
          ? prev
          : { due: dueCap, remaining: remainingCap },
      );
      setCappedLists(newCappedLists);
    };

    recalc();

    const observer = new ResizeObserver(recalc);
    [
      rootRef.current,
      duePanelRef.current,
      dueListRef.current,
      remainingPanelRef.current,
      remainingListRef.current,
    ].forEach((el) => {
      if (el) observer.observe(el);
    });

    const handleResize = () => {
      recalc();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [
    dueOpen,
    remainingOpen,
    dueView,
    dueList.length,
    remaining.length,
    menuOpen,
    duePanelOpen,
    remainingPanelOpen,
  ]);

  return (
    <div className="TodoPlus" ref={rootRef}>
      <div
        className={`panel${duePanelOpen ? " panel-open" : ""}${!dueOpen ? " panel-collapsed" : ""}`}
        ref={duePanelRef}
      >
        <div className="header">
          <div className="section-title">
            <div className="section-left">
              <button
                className="section-switch"
                onClick={() => {
                  closeAllMenus();
                  setDueViewMenuOpen(true);
                }}
                aria-label="Choose list view"
              >
                <span className="section-label">{dueLabel}</span>
              </button>
              <button
                className="section-collapse"
                onClick={() => setDueOpen(!dueOpen)}
                aria-label="Collapse list"
              >
                <Icon name={dueOpen ? "chevron-down" : "chevron-right"} />
              </button>
            </div>
            <button
              className="section-menu"
              onClick={() => {
                closeAllMenus();
                setDueListMenuOpen(true);
              }}
              aria-label="List options"
            >
              <Icon name="more-horizontal" />
            </button>
          </div>
        </div>
        {dueViewMenuOpen && (
          <div className="due-view-menu">
            <button
              onClick={() => {
                setDueView("today");
                closeAllMenus();
              }}
            >
              Due Today
            </button>
            <button
              onClick={() => {
                setDueView("finished");
                closeAllMenus();
              }}
            >
              Finished Tasks
            </button>
          </div>
        )}
        {dueListMenuOpen && (
          <div className="list-menu">
            <button
              onClick={() => {
                setDueListMenuOpen(false);
                closeAllMenus();
              }}
            >
              Settings
            </button>
            <button
              onClick={() => {
                activeListRef.current = 0;
                removeCompleted(dueList);
                closeAllMenus();
              }}
            >
              Delete completed items
            </button>
          </div>
        )}
        <div
          className="list"
          ref={dueListRef}
          style={{
            maxHeight: dueOpen ? `${listCaps.due}px` : "0px",
            overflowY: dueOpen ? "auto" : "hidden",
          }}
        >
          {dueOpen && (
            <>
              {dueList.length ? (
                renderItems(dueList, 0, {
                  showDue: true,
                  showRepeat: true,
                })
              ) : (
                <div className="empty">
                  {dueView === "today" ? "No tasks due today" : "No finished tasks"}
                </div>
              )}
            </>
          )}
        </div>

      </div>

      <div
        className={`panel${remainingPanelOpen ? " panel-open" : ""}${!remainingOpen ? " panel-collapsed" : ""}`}
        ref={remainingPanelRef}
      >
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
                activeListRef.current = 1;
                removeCompleted(remaining);
                closeAllMenus();
              }}
            >
              Delete completed items
            </button>
          </div>
        )}
        <div
          className="list"
          ref={remainingListRef}
          style={{
            maxHeight: remainingOpen ? `${listCaps.remaining}px` : "0px",
            overflowY: remainingOpen ? "auto" : "hidden",
          }}
        >
          {remainingOpen && (
            <>
              {remaining.length ? (
                renderItems(remainingSorted, 1, { showDue: true, showRepeat: true })
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

            <button
              className={`due-today${showMenuToggle ? "" : " hidden-control"}`}
              onClick={() => handleAddWithDueDate(getYmd(new Date()))}
              aria-label="Set due today"
              tabIndex={showMenuToggle ? 0 : -1}
            >
              Due Today
            </button>
            <button
              className={`menu-toggle${menuOpen ? " open" : ""}${showMenuToggle ? "" : " hidden-control"}`}
              onClick={() => {
                closeAllMenus();
                setMenuOpen(true);
              }}
              aria-label="Task options"
              tabIndex={showMenuToggle ? 0 : -1}
            >
              <Icon name="more-horizontal" />
            </button>
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
                const submitted = submitTaskWithMeta(next);
                if (!submitted && next?.dueDate) {
                  setDueDate(next.dueDate);
                }
                // Close menus without re-submitting (submitTaskWithMeta already handled it)
                setMenuOpen(false);
                setRemainingMenuOpen(false);
                setDueListMenuOpen(false);
                setDueViewMenuOpen(false);
                setCompleteMenuId(null);
                setItemMenuId(null);
              },
            )}
        </div>
      </div>
    </div>
  );
};

export default TodoPlus;
