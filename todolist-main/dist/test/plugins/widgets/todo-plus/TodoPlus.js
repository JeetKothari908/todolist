"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const hooks_1 = require("../../../hooks");
const ui_1 = require("../../../contexts/ui");
const shared_1 = require("../../../views/shared");
const actions_1 = require("../todo/actions");
const nanoid_1 = require("nanoid");
const reducer_1 = require("../todo/reducer");
const types_1 = require("../todo/types");
require("./TodoPlus.sass");
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const getYmd = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (value) => {
    if (!value)
        return null;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const nextRepeatDate = (repeat, dueDate, today) => {
    var _a;
    const base = (_a = parseDate(dueDate)) !== null && _a !== void 0 ? _a : today;
    if (repeat.type === "daily")
        return addDays(base, 1);
    const selectedDays = repeat.type === "custom"
        ? repeat.days
        : repeat.days && repeat.days.length
            ? repeat.days
            : [base.getDay()];
    if (!selectedDays.length)
        return null;
    for (let offset = 1; offset <= 7; offset += 1) {
        const candidate = addDays(base, offset);
        if (selectedDays.includes(candidate.getDay()))
            return candidate;
    }
    return null;
};
const firstRepeatDate = (repeat, today) => {
    if (repeat.type === "daily")
        return today;
    const selectedDays = repeat.type === "custom"
        ? repeat.days
        : repeat.days && repeat.days.length
            ? repeat.days
            : [today.getDay()];
    if (!selectedDays.length)
        return null;
    for (let offset = 0; offset <= 6; offset += 1) {
        const candidate = addDays(today, offset);
        if (selectedDays.includes(candidate.getDay()))
            return candidate;
    }
    return null;
};
const TodoPlus = ({ data = types_1.defaultData, setData }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { toggleSettings } = react_1.default.useContext(ui_1.UiContext);
    const rootRef = (0, react_1.useRef)(null);
    const duePanelRef = (0, react_1.useRef)(null);
    const dueListRef = (0, react_1.useRef)(null);
    const remainingPanelRef = (0, react_1.useRef)(null);
    const remainingListRef = (0, react_1.useRef)(null);
    const [input, setInput] = (0, react_1.useState)("");
    const [inputFocused, setInputFocused] = (0, react_1.useState)(false);
    const [menuOpen, setMenuOpen] = (0, react_1.useState)(false);
    const [remainingMenuOpen, setRemainingMenuOpen] = (0, react_1.useState)(false);
    const [dueListMenuOpen, setDueListMenuOpen] = (0, react_1.useState)(false);
    const [dueViewMenuOpen, setDueViewMenuOpen] = (0, react_1.useState)(false);
    const [dueView, setDueView] = (0, react_1.useState)("today");
    const [completeMenuId, setCompleteMenuId] = (0, react_1.useState)(null);
    const [itemMenuId, setItemMenuId] = (0, react_1.useState)(null);
    const [popoverAnchor, setPopoverAnchor] = (0, react_1.useState)(null);
    const [completeMenuAnchor, setCompleteMenuAnchor] = (0, react_1.useState)(null);
    const [draftItemMeta, setDraftItemMeta] = (0, react_1.useState)(null);
    const [dueDate, setDueDate] = (0, react_1.useState)(undefined);
    const [repeatType, setRepeatType] = (0, react_1.useState)("none");
    const [customDays, setCustomDays] = (0, react_1.useState)([]);
    const [dueOpen, setDueOpen] = (0, react_1.useState)(true);
    const [remainingOpen, setRemainingOpen] = (0, react_1.useState)(true);
    const [listCaps, setListCaps] = (0, react_1.useState)({ due: 220, remaining: 220 });
    const [cappedLists, setCappedLists] = (0, react_1.useState)({ due: false, remaining: false });
    const activeListRef = (0, react_1.useRef)(1); // 0 = due panel, 1 = inbox panel
    const customLists = (_a = data === null || data === void 0 ? void 0 : data.customLists) !== null && _a !== void 0 ? _a : [];
    const [selectedListId, setSelectedListId] = (0, react_1.useState)(undefined);
    const [listPickerOpen, setListPickerOpen] = (0, react_1.useState)(false);
    const [addingListPanel, setAddingListPanel] = (0, react_1.useState)(null);
    const [newListName, setNewListName] = (0, react_1.useState)("");
    const [renamingListId, setRenamingListId] = (0, react_1.useState)(null);
    const [renameValue, setRenameValue] = (0, react_1.useState)("");
    const [inboxViewMenuOpen, setInboxViewMenuOpen] = (0, react_1.useState)(false);
    const [inboxView, setInboxView] = (0, react_1.useState)("inbox");
    const repeatEqual = (a, b) => {
        var _a, _b;
        if (!a && !b)
            return true;
        if (!a || !b)
            return false;
        if (a.type !== b.type)
            return false;
        if (a.type === "custom" && b.type === "custom") {
            const aDays = [...((_a = a.days) !== null && _a !== void 0 ? _a : [])].sort();
            const bDays = [...((_b = b.days) !== null && _b !== void 0 ? _b : [])].sort();
            return aDays.length === bDays.length && aDays.every((d, i) => d === bDays[i]);
        }
        return true;
    };
    const normalizeRepeat = (repeat) => {
        if (!repeat)
            return undefined;
        if (repeat.type === "custom" && (!repeat.days || repeat.days.length === 0))
            return undefined;
        return repeat;
    };
    const commitDraftItemMeta = () => {
        if (!draftItemMeta)
            return;
        const current = itemById.get(draftItemMeta.id);
        if (!current) {
            setDraftItemMeta(null);
            return;
        }
        const finalRepeat = normalizeRepeat(draftItemMeta.repeat);
        if (current.dueDate !== draftItemMeta.dueDate ||
            !repeatEqual(current.repeat, finalRepeat)) {
            dispatch((0, actions_1.updateTodoMeta)(draftItemMeta.id, {
                dueDate: draftItemMeta.dueDate,
                repeat: finalRepeat,
            }));
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
        setInboxViewMenuOpen(false);
        setCompleteMenuId(null);
        setCompleteMenuAnchor(null);
        setItemMenuId(null);
        setPopoverAnchor(null);
        setListPickerOpen(false);
        if (addingListPanel && newListName.trim()) {
            commitAddList();
        }
        setAddingListPanel(null);
        setNewListName("");
        if (renamingListId && renameValue.trim()) {
            commitRename();
        }
        setRenamingListId(null);
        setRenameValue("");
    };
    const closeAllMenusRef = (0, react_1.useRef)(closeAllMenus);
    closeAllMenusRef.current = closeAllMenus;
    (0, react_1.useEffect)(() => {
        const handleClick = (event) => {
            const target = event.target;
            if (target.closest(".list-menu") ||
                target.closest(".menu") ||
                target.closest(".item-popover") ||
                target.closest(".section-menu") ||
                target.closest(".item-menu") ||
                target.closest(".menu-toggle") ||
                target.closest(".due-view-menu") ||
                target.closest(".inbox-view-menu") ||
                target.closest(".complete-menu") ||
                target.closest(".list-picker") ||
                target.closest(".inline-add-list") ||
                target.closest(".inline-rename")) {
                return;
            }
            closeAllMenusRef.current();
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    const setItems = (items) => setData(Object.assign(Object.assign({}, data), { items }));
    const [items, dispatch] = (0, hooks_1.useSavedReducer)(reducer_1.reducer, data.items, setItems);
    const today = new Date();
    const todayYmd = getYmd(today);
    const todayDay = today.getDay();
    // Latest items/data refs so the daily-clear effect doesn't read stale values
    const itemsRef = (0, react_1.useRef)(items);
    itemsRef.current = items;
    const dataRef = (0, react_1.useRef)(data);
    dataRef.current = data;
    // Auto-dismiss completed items from the "due today" list at the start of each new day.
    // The lastClearedDate write is deferred to a setTimeout so it fires AFTER the reducer's
    // items-save effect has propagated through setData; otherwise the two setData calls
    // (which both spread `data` whole) race and the later one drops the dismissed items.
    (0, react_1.useEffect)(() => {
        if (dataRef.current.lastClearedDate === todayYmd)
            return;
        const toClear = itemsRef.current.filter((item) => !item.dismissed &&
            item.completed &&
            item.dueDate &&
            item.dueDate < todayYmd);
        if (toClear.length === 0) {
            setData(Object.assign(Object.assign({}, dataRef.current), { lastClearedDate: todayYmd }));
            return;
        }
        toClear.forEach((item) => dispatch((0, actions_1.dismissTodo)(item.id)));
        const handle = setTimeout(() => {
            setData(Object.assign(Object.assign({}, dataRef.current), { lastClearedDate: todayYmd }));
        }, 0);
        return () => clearTimeout(handle);
    }, [todayYmd]);
    const repeat = (0, react_1.useMemo)(() => {
        if (repeatType === "daily")
            return { type: "daily" };
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
        if (!trimmed)
            return;
        activeListRef.current = dueDate === todayYmd ? 0 : 1;
        dispatch((0, actions_1.addTodo)(trimmed, { dueDate, repeat, listId: selectedListId }));
        setInput("");
        setDueDate(undefined);
        setRepeatType("none");
        setCustomDays([]);
    }
    const submitTaskWithMeta = (meta) => {
        var _a, _b;
        const trimmed = input.trim();
        if (!trimmed)
            return false;
        const finalDueDate = (_a = meta === null || meta === void 0 ? void 0 : meta.dueDate) !== null && _a !== void 0 ? _a : dueDate;
        activeListRef.current = finalDueDate === todayYmd ? 0 : 1;
        dispatch((0, actions_1.addTodo)(trimmed, {
            dueDate: finalDueDate,
            repeat: (_b = meta === null || meta === void 0 ? void 0 : meta.repeat) !== null && _b !== void 0 ? _b : repeat,
            listId: selectedListId,
        }));
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
    const handleAddWithDueDate = (date) => {
        const trimmed = input.trim();
        if (!trimmed) {
            setDueDate(date);
            return;
        }
        submitTaskWithMeta({ dueDate: date });
        closeAllMenus();
    };
    const showMenuToggle = inputFocused || input.trim().length > 0;
    // ── List CRUD helpers ─────────────────────────────────────
    const commitAddList = () => {
        const trimmed = newListName.trim();
        if (!trimmed)
            return;
        const newList = { id: (0, nanoid_1.nanoid)(), name: trimmed };
        setData(Object.assign(Object.assign({}, data), { customLists: [...customLists, newList] }));
        // Switch the panel that initiated the add to show the new list
        if (addingListPanel === "due")
            setDueView(newList.id);
        else if (addingListPanel === "inbox")
            setInboxView(newList.id);
        setNewListName("");
        setAddingListPanel(null);
    };
    const commitRename = () => {
        if (!renamingListId)
            return;
        const trimmed = renameValue.trim();
        if (!trimmed) {
            setRenamingListId(null);
            return;
        }
        setData(Object.assign(Object.assign({}, data), { customLists: customLists.map((l) => l.id === renamingListId ? Object.assign(Object.assign({}, l), { name: trimmed }) : l) }));
        setRenamingListId(null);
        setRenameValue("");
    };
    const deleteList = (listId) => {
        // Move all tasks in the deleted list back to inbox
        const affected = items.filter((item) => item.listId === listId);
        affected.forEach((item) => dispatch((0, actions_1.moveTodo)(item.id, undefined)));
        // Defer the customLists update so it fires after the reducer's items-save
        // setData has propagated; otherwise it would race and clobber the moveTodo
        // results (both setData calls spread `data` whole and the later one wins).
        const writeLists = () => {
            var _a;
            setData(Object.assign(Object.assign({}, dataRef.current), { customLists: ((_a = dataRef.current.customLists) !== null && _a !== void 0 ? _a : []).filter((l) => l.id !== listId) }));
        };
        if (affected.length === 0) {
            writeLists();
        }
        else {
            setTimeout(writeLists, 0);
        }
        // Reset views/selection if they were pointing at the deleted list
        if (dueView === listId)
            setDueView("today");
        if (inboxView === listId)
            setInboxView("inbox");
        if (selectedListId === listId)
            setSelectedListId(undefined);
    };
    const startAddList = (panel) => {
        closeAllMenus();
        setNewListName("");
        setAddingListPanel(panel);
    };
    const startRenameList = (list) => {
        closeAllMenus();
        setRenameValue(list.name);
        setRenamingListId(list.id);
    };
    // ──────────────────────────────────────────────────────────
    const formatDueDate = (date) => {
        if (!date)
            return null;
        const parsed = parseDate(date);
        if (!parsed || Number.isNaN(parsed.getTime()))
            return date;
        return parsed.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    };
    const formatRepeat = (value) => {
        var _a;
        if (!value)
            return null;
        if (value.type === "daily")
            return "Daily";
        if (value.type === "weekly")
            return "Weekly";
        if (value.type === "custom") {
            const days = ((_a = value.days) === null || _a === void 0 ? void 0 : _a.length) > 0
                ? value.days.map((day) => dayLabels[day]).join(", ")
                : "";
            return days ? days : "Custom";
        }
        return null;
    };
    const getRepeatDerivedDueDate = (repeat) => {
        if (!repeat)
            return undefined;
        const firstDate = firstRepeatDate(repeat, today);
        return firstDate ? getYmd(firstDate) : undefined;
    };
    const getTaskDisplayDueDate = (item) => { var _a; return (_a = item.dueDate) !== null && _a !== void 0 ? _a : (item.repeat ? getRepeatDerivedDueDate(item.repeat) : undefined); };
    const getRepeatDays = (item) => {
        var _a;
        if (!item.repeat)
            return null;
        if (item.repeat.type === "daily")
            return [0, 1, 2, 3, 4, 5, 6];
        if (item.repeat.type === "custom")
            return (_a = item.repeat.days) !== null && _a !== void 0 ? _a : [];
        if (item.repeat.type === "weekly") {
            if (item.repeat.days && item.repeat.days.length)
                return item.repeat.days;
            const parsed = parseDate(item.dueDate);
            return parsed ? [parsed.getDay()] : [];
        }
        return null;
    };
    const isOverdue = (item) => {
        if (!item.dueDate || item.completed)
            return false;
        return item.dueDate < todayYmd;
    };
    const isDueToday = (item) => {
        if (item.dueDate && item.dueDate === todayYmd)
            return true;
        // Overdue items (due date before today) should appear in the due today list
        if (item.dueDate && item.dueDate < todayYmd)
            return true;
        const repeatDays = getRepeatDays(item);
        if (!repeatDays)
            return false;
        if (item.dueDate) {
            const start = parseDate(item.dueDate);
            if (start && start > today)
                return false;
        }
        return repeatDays.includes(todayDay);
    };
    const activeItems = items.filter((item) => !item.dismissed);
    const finished = items.filter((item) => item.dismissed);
    // Determine effective list membership (invalid listIds fall back to inbox)
    const customListIds = (0, react_1.useMemo)(() => new Set(customLists.map((l) => l.id)), [customLists]);
    const getEffectiveListId = (item) => item.listId && customListIds.has(item.listId) ? item.listId : undefined;
    // Items not assigned to any custom list
    const unlistedActive = activeItems.filter((item) => !getEffectiveListId(item));
    const dueToday = [...unlistedActive.filter((item) => isDueToday(item))].sort((a, b) => {
        if (a.completed !== b.completed)
            return a.completed ? 1 : -1;
        return 0;
    });
    const remaining = unlistedActive.filter((item) => !isDueToday(item));
    const remainingSorted = [...remaining].sort((a, b) => {
        if (a.completed !== b.completed)
            return a.completed ? 1 : -1;
        const aDue = getTaskDisplayDueDate(a);
        const bDue = getTaskDisplayDueDate(b);
        if (!aDue && !bDue)
            return 0;
        if (!aDue)
            return -1;
        if (!bDue)
            return 1;
        return aDue.localeCompare(bDue);
    });
    const finishedSorted = [...finished].sort((a, b) => {
        const aDue = getTaskDisplayDueDate(a);
        const bDue = getTaskDisplayDueDate(b);
        if (!aDue && !bDue)
            return 0;
        if (!aDue)
            return -1;
        if (!bDue)
            return 1;
        return aDue.localeCompare(bDue);
    });
    // Items in custom lists (active, not dismissed)
    const customListItemsMap = {};
    customLists.forEach((cl) => {
        const clItems = activeItems.filter((item) => getEffectiveListId(item) === cl.id);
        customListItemsMap[cl.id] = [...clItems].sort((a, b) => {
            if (a.completed !== b.completed)
                return a.completed ? 1 : -1;
            const aDue = getTaskDisplayDueDate(a);
            const bDue = getTaskDisplayDueDate(b);
            if (!aDue && !bDue)
                return 0;
            if (!aDue)
                return -1;
            if (!bDue)
                return 1;
            return aDue.localeCompare(bDue);
        });
    });
    const dueList = dueView === "today"
        ? dueToday
        : dueView === "finished"
            ? finishedSorted
            : (_b = customListItemsMap[dueView]) !== null && _b !== void 0 ? _b : [];
    const dueLabel = dueView === "today"
        ? "Due Today"
        : dueView === "finished"
            ? "Finished Tasks"
            : (_d = (_c = customLists.find((l) => l.id === dueView)) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "Unknown List";
    const inboxList = inboxView === "inbox"
        ? remainingSorted
        : (_e = customListItemsMap[inboxView]) !== null && _e !== void 0 ? _e : [];
    const inboxLabel = inboxView === "inbox"
        ? "Inbox"
        : (_g = (_f = customLists.find((l) => l.id === inboxView)) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : "Unknown List";
    // In the Finished view every item is dismissed (and "finished" is what the user
    // sees), so remove the dismissed ones. Elsewhere "Remove Finished Items" means
    // the completed ones in that view.
    const removeCompleted = (list, finishedView = false) => {
        const predicate = finishedView
            ? (item) => item.dismissed
            : (item) => item.completed;
        list.filter(predicate).forEach((item) => {
            dispatch((0, actions_1.removeTodo)(item.id));
        });
    };
    const itemById = (0, react_1.useMemo)(() => new Map(items.map((item) => [item.id, item])), [items]);
    const renderRepeatMenu = (currentRepeat, onRepeatChange, currentDueDate, onDueDateChange, onClose) => {
        var _a, _b;
        return (react_1.default.createElement("div", { className: "menu" },
            react_1.default.createElement("div", { className: "menu-row" },
                react_1.default.createElement("div", { className: "menu-row-label" },
                    react_1.default.createElement("span", null, "Due date"),
                    (currentDueDate || getRepeatDerivedDueDate(currentRepeat)) && (react_1.default.createElement("span", { className: "menu-row-value" }, formatDueDate(currentDueDate !== null && currentDueDate !== void 0 ? currentDueDate : getRepeatDerivedDueDate(currentRepeat))))),
                react_1.default.createElement("label", { className: "calendar-button" },
                    react_1.default.createElement(shared_1.Icon, { name: "calendar" }),
                    react_1.default.createElement("input", { type: "date", value: currentDueDate !== null && currentDueDate !== void 0 ? currentDueDate : "", onChange: (event) => {
                            const nextDueDate = event.target.value || undefined;
                            onDueDateChange === null || onDueDateChange === void 0 ? void 0 : onDueDateChange(nextDueDate);
                            onClose === null || onClose === void 0 ? void 0 : onClose({ dueDate: nextDueDate, repeat: currentRepeat });
                        } }))),
            react_1.default.createElement("div", { className: "repeat" },
                react_1.default.createElement("span", null, "Repeat"),
                react_1.default.createElement("div", { className: "repeat-options" }, ["none", "daily", "weekly", "custom"].map((option) => {
                    var _a;
                    return (react_1.default.createElement("button", { key: option, className: ((_a = currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) !== null && _a !== void 0 ? _a : "none") === option ? "active" : "", onClick: () => {
                            const nextRepeat = option === "none"
                                ? undefined
                                : option === "daily"
                                    ? { type: "daily" }
                                    : option === "weekly"
                                        ? {
                                            type: "weekly",
                                            days: (currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) === "weekly"
                                                ? currentRepeat.days
                                                : (currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) === "custom"
                                                    ? currentRepeat.days
                                                    : [todayDay],
                                        }
                                        : {
                                            type: "custom",
                                            days: (currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) === "custom"
                                                ? currentRepeat.days
                                                : [],
                                        };
                            onRepeatChange(nextRepeat);
                            if (option === "custom" &&
                                !currentDueDate &&
                                nextRepeat &&
                                nextRepeat.type === "custom") {
                                // Repeat-derived due date is displayed independently from manual dueDate.
                            }
                            if (option === "daily" || option === "none") {
                                onClose === null || onClose === void 0 ? void 0 : onClose({ dueDate: currentDueDate, repeat: nextRepeat });
                            }
                        } }, option === "none"
                        ? "None"
                        : option === "daily"
                            ? "Daily"
                            : option === "weekly"
                                ? "Weekly"
                                : "Custom"));
                })),
                (((_a = currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) !== null && _a !== void 0 ? _a : "none") === "custom" ||
                    ((_b = currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) !== null && _b !== void 0 ? _b : "none") === "weekly") && (react_1.default.createElement("div", { className: "custom-days" }, dayLabels.map((label, index) => {
                    var _a, _b;
                    const isWeekly = ((_a = currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) !== null && _a !== void 0 ? _a : "none") === "weekly";
                    const days = (currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) === "custom"
                        ? currentRepeat.days
                        : (currentRepeat === null || currentRepeat === void 0 ? void 0 : currentRepeat.type) === "weekly"
                            ? (_b = currentRepeat.days) !== null && _b !== void 0 ? _b : []
                            : [];
                    const active = days.includes(index);
                    return (react_1.default.createElement("button", { key: label, className: active ? "active" : "", onClick: () => {
                            if (isWeekly) {
                                const nextRepeat = { type: "weekly", days: [index] };
                                onRepeatChange(nextRepeat);
                                onClose === null || onClose === void 0 ? void 0 : onClose({ dueDate: currentDueDate, repeat: nextRepeat });
                                return;
                            }
                            onRepeatChange({
                                type: "custom",
                                days: active
                                    ? days.filter((d) => d !== index)
                                    : days.concat(index),
                            });
                        } }, label));
                }))))));
    };
    const renderItems = (list, listIdx, options = {
        showDue: true,
        showRepeat: true,
    }) => list.map((item, index) => {
        var _a;
        const isDrafting = (draftItemMeta === null || draftItemMeta === void 0 ? void 0 : draftItemMeta.id) === item.id;
        const displayRepeat = isDrafting ? normalizeRepeat(draftItemMeta.repeat) : item.repeat;
        const displayDueDate = isDrafting
            ? ((_a = draftItemMeta.dueDate) !== null && _a !== void 0 ? _a : (displayRepeat ? getRepeatDerivedDueDate(displayRepeat) : undefined))
            : getTaskDisplayDueDate(item);
        return (react_1.default.createElement("div", { key: item.id, className: `item${item.completed ? " completed" : ""}${isOverdue(item) ? " overdue" : ""}` },
            react_1.default.createElement("button", { className: "check", "aria-label": "Toggle task", onClick: (e) => {
                    activeListRef.current = listIdx;
                    if (item.completed) {
                        if (item.parentId) {
                            dispatch((0, actions_1.uncompleteRepeatInstance)(item.id, item.parentId, item.dueDate));
                        }
                        else {
                            dispatch((0, actions_1.toggleTodo)(item.id));
                        }
                        return;
                    }
                    if (item.repeat) {
                        closeAllMenus();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setCompleteMenuAnchor({ top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom });
                        setCompleteMenuId((prev) => (prev === item.id ? null : item.id));
                        return;
                    }
                    dispatch((0, actions_1.toggleTodo)(item.id));
                } }, item.completed ? react_1.default.createElement(shared_1.Icon, { name: "check", size: 14 }) : null),
            react_1.default.createElement("div", { className: "content" },
                react_1.default.createElement("div", { className: "content-row" },
                    react_1.default.createElement("span", { className: "text", contentEditable: true, suppressContentEditableWarning: true, onBlur: (event) => dispatch((0, actions_1.updateTodo)(item.id, event.currentTarget.innerText)), onKeyDown: (event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                event.currentTarget.blur();
                            }
                            if (event.key === "Escape") {
                                event.preventDefault();
                                event.currentTarget.innerText = item.contents;
                                event.currentTarget.blur();
                            }
                        } }, item.contents),
                    item.completed && (react_1.default.createElement("span", { className: "completed-icon", onClick: () => {
                            activeListRef.current = listIdx;
                            dispatch((0, actions_1.dismissTodo)(item.id));
                        }, style: { cursor: "pointer" }, title: "Send to finished" },
                        react_1.default.createElement(shared_1.Icon, { name: "x", size: 12 }))),
                    ((options.showDue && displayDueDate) ||
                        (options.showRepeat && displayRepeat)) && (react_1.default.createElement("div", { className: "meta inline" },
                        options.showDue && displayDueDate && (react_1.default.createElement("span", null, formatDueDate(displayDueDate))),
                        options.showRepeat && displayRepeat && (react_1.default.createElement("span", null, formatRepeat(displayRepeat))))))),
            react_1.default.createElement("button", { className: "item-menu", "aria-label": "Task options", onClick: (e) => {
                    closeAllMenus();
                    setDraftItemMeta({
                        id: item.id,
                        dueDate: item.dueDate,
                        repeat: item.repeat,
                    });
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPopoverAnchor({ top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom });
                    setItemMenuId((prev) => (prev === item.id ? null : item.id));
                } },
                react_1.default.createElement(shared_1.Icon, { name: "more-horizontal" })),
            itemMenuId === item.id && popoverAnchor && (() => {
                var _a, _b;
                // Max height of the repeat menu fully expanded (due row + repeat options + custom days + padding/gaps)
                const estimatedMenuHeight = 200;
                const spaceBelow = window.innerHeight - popoverAnchor.bottom - 8;
                const popoverUp = spaceBelow < estimatedMenuHeight && popoverAnchor.top > spaceBelow;
                return react_dom_1.default.createPortal(react_1.default.createElement("div", { className: `TodoPlus-portal item-popover${popoverUp ? " up" : " down"}`, style: popoverUp
                        ? { position: "fixed", bottom: `${window.innerHeight - popoverAnchor.top + 8}px`, right: `${window.innerWidth - popoverAnchor.right}px` }
                        : { position: "fixed", top: `${popoverAnchor.bottom + 8}px`, right: `${window.innerWidth - popoverAnchor.right}px` } },
                    renderRepeatMenu((_a = draftItemMeta === null || draftItemMeta === void 0 ? void 0 : draftItemMeta.repeat) !== null && _a !== void 0 ? _a : item.repeat, (next) => setDraftItemMeta((prev) => ({
                        id: item.id,
                        dueDate: prev && prev.id === item.id
                            ? prev.dueDate
                            : item.dueDate,
                        repeat: next,
                    })), (draftItemMeta === null || draftItemMeta === void 0 ? void 0 : draftItemMeta.id) === item.id
                        ? draftItemMeta === null || draftItemMeta === void 0 ? void 0 : draftItemMeta.dueDate
                        : item.dueDate, (next) => setDraftItemMeta((prev) => ({
                        id: item.id,
                        dueDate: next,
                        repeat: prev && prev.id === item.id
                            ? prev.repeat
                            : item.repeat,
                    })), (next) => {
                        var _a, _b, _c, _d;
                        const current = itemById.get(item.id);
                        if (!current) {
                            setDraftItemMeta(null);
                            setItemMenuId(null);
                            return;
                        }
                        const nextDueDate = (_b = (_a = next === null || next === void 0 ? void 0 : next.dueDate) !== null && _a !== void 0 ? _a : draftItemMeta === null || draftItemMeta === void 0 ? void 0 : draftItemMeta.dueDate) !== null && _b !== void 0 ? _b : item.dueDate;
                        const nextRepeat = normalizeRepeat((_d = (_c = next === null || next === void 0 ? void 0 : next.repeat) !== null && _c !== void 0 ? _c : draftItemMeta === null || draftItemMeta === void 0 ? void 0 : draftItemMeta.repeat) !== null && _d !== void 0 ? _d : item.repeat);
                        if (current.dueDate !== nextDueDate ||
                            !repeatEqual(current.repeat, nextRepeat)) {
                            activeListRef.current = listIdx;
                            dispatch((0, actions_1.updateTodoMeta)(item.id, {
                                dueDate: nextDueDate,
                                repeat: nextRepeat,
                            }));
                        }
                        setDraftItemMeta(null);
                        setItemMenuId(null);
                    }),
                    customLists.length > 0 && (react_1.default.createElement("div", { className: "menu-row", style: { marginTop: "4px", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.08)" } },
                        react_1.default.createElement("span", null, "List"),
                        react_1.default.createElement("select", { value: (_b = item.listId) !== null && _b !== void 0 ? _b : "", onChange: (e) => {
                                const newListId = e.target.value || undefined;
                                dispatch((0, actions_1.moveTodo)(item.id, newListId));
                                commitDraftItemMeta();
                                setItemMenuId(null);
                                setPopoverAnchor(null);
                            }, style: {
                                border: "1px solid rgba(0,0,0,0.12)",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                fontSize: "12px",
                                background: "#fff",
                                color: "#3c3c3c",
                                cursor: "pointer",
                            } },
                            react_1.default.createElement("option", { value: "" }, "Inbox"),
                            customLists.map((cl) => (react_1.default.createElement("option", { key: cl.id, value: cl.id }, cl.name))))))), document.body);
            })(),
            completeMenuId === item.id && completeMenuAnchor && (() => {
                const estimatedCompleteHeight = 80;
                const spaceBelow = window.innerHeight - completeMenuAnchor.bottom - 8;
                const completeUp = spaceBelow < estimatedCompleteHeight && completeMenuAnchor.top > spaceBelow;
                return react_dom_1.default.createPortal(react_1.default.createElement("div", { className: `TodoPlus-portal complete-menu${completeUp ? " up" : " down"}`, style: completeUp
                        ? { position: "fixed", bottom: `${window.innerHeight - completeMenuAnchor.top + 8}px`, left: `${completeMenuAnchor.left}px` }
                        : { position: "fixed", top: `${completeMenuAnchor.bottom + 8}px`, left: `${completeMenuAnchor.left}px` } },
                    react_1.default.createElement("button", { onClick: () => {
                            var _a;
                            activeListRef.current = listIdx;
                            if (!item.repeat) {
                                setCompleteMenuId(null);
                                return;
                            }
                            const currentDueDate = (_a = item.dueDate) !== null && _a !== void 0 ? _a : getRepeatDerivedDueDate(item.repeat);
                            // Collect dates that already have completed sibling instances
                            const siblingDates = new Set(items
                                .filter((i) => i.parentId === item.id && i.completed && i.dueDate)
                                .map((i) => i.dueDate));
                            // Advance past dates that already have a completed instance
                            let next = nextRepeatDate(item.repeat, currentDueDate, today);
                            let safety = 0;
                            while (next && siblingDates.has(getYmd(next)) && safety < 365) {
                                next = nextRepeatDate(item.repeat, getYmd(next), today);
                                safety += 1;
                            }
                            if (next) {
                                dispatch((0, actions_1.completeRepeatInstance)(item.id, currentDueDate, getYmd(next)));
                            }
                            setCompleteMenuId(null);
                        } }, "Completed This Instance"),
                    react_1.default.createElement("button", { onClick: () => {
                            activeListRef.current = listIdx;
                            dispatch((0, actions_1.toggleTodo)(item.id));
                            setCompleteMenuId(null);
                        } }, "Complete Task")), document.body);
            })(),
            react_1.default.createElement("button", { className: "delete", "aria-label": "Delete task", onClick: () => {
                    activeListRef.current = listIdx;
                    dispatch((0, actions_1.removeTodo)(item.id));
                } },
                react_1.default.createElement(shared_1.RemoveIcon, null))));
    });
    // Panel-level elevation (z-index)
    const duePanelOpen = dueViewMenuOpen || dueListMenuOpen;
    const remainingPanelOpen = menuOpen || remainingMenuOpen || listPickerOpen || inboxViewMenuOpen;
    (0, react_1.useEffect)(() => {
        const recalc = () => {
            if (!rootRef.current ||
                !duePanelRef.current ||
                !dueListRef.current ||
                !remainingPanelRef.current ||
                !remainingListRef.current) {
                return;
            }
            const viewportHeight = window.innerHeight;
            const verticalPadding = Math.max(40, Math.round(viewportHeight * 0.12));
            const availableHeight = Math.max(0, viewportHeight - verticalPadding);
            const panels = [];
            panels.push({
                key: "due",
                fixed: duePanelRef.current.offsetHeight - dueListRef.current.offsetHeight,
                need: dueOpen ? dueListRef.current.scrollHeight : 0,
            });
            panels.push({
                key: "remaining",
                fixed: remainingPanelRef.current.offsetHeight - remainingListRef.current.offsetHeight,
                need: remainingOpen ? remainingListRef.current.scrollHeight : 0,
            });
            const rootStyles = getComputedStyle(rootRef.current);
            const gapFromCss = Number.parseFloat(rootStyles.rowGap || rootStyles.gap || "0");
            const panelGap = Number.isFinite(gapFromCss) && gapFromCss > 0
                ? gapFromCss
                : Math.max(8, Math.round(viewportHeight * 0.012));
            const totalFixed = panels.reduce((sum, p) => sum + p.fixed, 0);
            const free = Math.max(0, availableHeight - totalFixed - panelGap * Math.max(0, panels.length - 1));
            // Proportional allocation with surplus redistribution
            const caps = {};
            const openPanels = panels.filter((p) => p.need > 0);
            const totalNeed = openPanels.reduce((sum, p) => sum + p.need, 0);
            if (totalNeed <= free) {
                panels.forEach((p) => { caps[p.key] = p.need; });
            }
            else if (totalNeed > 0) {
                const sorted = [...openPanels].sort((a, b) => a.need - b.need);
                let remainingFree = free;
                let remainingCount = sorted.length;
                for (const p of sorted) {
                    const share = Math.floor(remainingFree / remainingCount);
                    if (p.need <= share) {
                        caps[p.key] = p.need;
                        remainingFree -= p.need;
                    }
                    else {
                        caps[p.key] = share;
                        remainingFree -= share;
                    }
                    remainingCount -= 1;
                }
                panels.filter((p) => p.need === 0).forEach((p) => { caps[p.key] = 0; });
            }
            else {
                panels.forEach((p) => { caps[p.key] = 0; });
            }
            const newCappedLists = {};
            panels.forEach((p) => {
                var _a;
                newCappedLists[p.key] = p.need > ((_a = caps[p.key]) !== null && _a !== void 0 ? _a : 0);
            });
            setListCaps((prev) => {
                const changed = panels.some((p) => prev[p.key] !== caps[p.key]);
                return changed ? caps : prev;
            });
            setCappedLists(newCappedLists);
        };
        recalc();
        const observer = new ResizeObserver(recalc);
        const elementsToObserve = [
            rootRef.current,
            duePanelRef.current,
            dueListRef.current,
            remainingPanelRef.current,
            remainingListRef.current,
        ];
        elementsToObserve.forEach((el) => {
            if (el)
                observer.observe(el);
        });
        const handleResize = () => { recalc(); };
        window.addEventListener("resize", handleResize);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", handleResize);
        };
    }, [
        dueOpen,
        remainingOpen,
        dueView,
        inboxView,
        dueList.length,
        inboxList.length,
        menuOpen,
        duePanelOpen,
        remainingPanelOpen,
    ]);
    return (react_1.default.createElement("div", { className: "TodoPlus", ref: rootRef },
        react_1.default.createElement("div", { className: `panel${duePanelOpen ? " panel-open" : ""}${!dueOpen ? " panel-collapsed" : ""}`, ref: duePanelRef },
            react_1.default.createElement("div", { className: "header" },
                react_1.default.createElement("div", { className: "section-title" },
                    react_1.default.createElement("div", { className: "section-left" },
                        addingListPanel === "due" ? (react_1.default.createElement("div", { className: "inline-rename" },
                            react_1.default.createElement("input", { type: "text", placeholder: "New list name", value: newListName, onChange: (e) => setNewListName(e.target.value), onKeyDown: (e) => {
                                    if (e.key === "Enter")
                                        commitAddList();
                                    if (e.key === "Escape") {
                                        setAddingListPanel(null);
                                        setNewListName("");
                                    }
                                }, onBlur: () => { if (newListName.trim())
                                    commitAddList();
                                else {
                                    setAddingListPanel(null);
                                    setNewListName("");
                                } }, autoFocus: true }))) : renamingListId && renamingListId === dueView ? (react_1.default.createElement("div", { className: "inline-rename" },
                            react_1.default.createElement("input", { type: "text", value: renameValue, onChange: (e) => setRenameValue(e.target.value), onKeyDown: (e) => {
                                    if (e.key === "Enter")
                                        commitRename();
                                    if (e.key === "Escape") {
                                        setRenamingListId(null);
                                        setRenameValue("");
                                    }
                                }, onBlur: commitRename, autoFocus: true }))) : (react_1.default.createElement("button", { className: "section-switch", onClick: () => {
                                closeAllMenus();
                                setDueViewMenuOpen(true);
                            }, "aria-label": "Choose list view" },
                            react_1.default.createElement("span", { className: "section-label" }, dueLabel))),
                        react_1.default.createElement("button", { className: "section-collapse", onClick: () => setDueOpen(!dueOpen), "aria-label": "Collapse list" },
                            react_1.default.createElement(shared_1.Icon, { name: dueOpen ? "chevron-down" : "chevron-right" }))),
                    react_1.default.createElement("button", { className: "section-menu", onClick: () => {
                            closeAllMenus();
                            setDueListMenuOpen(true);
                        }, "aria-label": "List options" },
                        react_1.default.createElement(shared_1.Icon, { name: "more-horizontal" })))),
            dueViewMenuOpen && (react_1.default.createElement("div", { className: "due-view-menu" },
                react_1.default.createElement("button", { onClick: () => {
                        setDueView("today");
                        closeAllMenus();
                    } }, "Due Today"),
                react_1.default.createElement("button", { onClick: () => {
                        setDueView("finished");
                        closeAllMenus();
                    } }, "Finished Tasks"),
                customLists.map((cl) => (react_1.default.createElement("button", { key: cl.id, onClick: () => {
                        setDueView(cl.id);
                        closeAllMenus();
                    } }, cl.name))))),
            dueListMenuOpen && (react_1.default.createElement("div", { className: "list-menu" },
                react_1.default.createElement("button", { onClick: () => {
                        closeAllMenus();
                        toggleSettings();
                    } }, "Settings"),
                react_1.default.createElement("button", { onClick: () => {
                        activeListRef.current = 0;
                        removeCompleted(dueList, dueView === "finished");
                        closeAllMenus();
                    } }, "Remove Finished Items"),
                react_1.default.createElement("button", { onClick: () => startAddList("due") }, "Add List"),
                dueView !== "today" && dueView !== "finished" && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("button", { onClick: () => {
                            const list = customLists.find((l) => l.id === dueView);
                            if (list)
                                startRenameList(list);
                        } }, "Rename List"),
                    react_1.default.createElement("button", { onClick: () => {
                            closeAllMenus();
                            deleteList(dueView);
                        } }, "Delete List"))))),
            react_1.default.createElement("div", { className: "list", ref: dueListRef, style: {
                    maxHeight: dueOpen ? `${listCaps.due}px` : "0px",
                    overflowY: dueOpen ? "auto" : "hidden",
                } }, dueOpen && (react_1.default.createElement(react_1.default.Fragment, null, dueList.length ? (renderItems(dueList, 0, {
                showDue: true,
                showRepeat: true,
            })) : (react_1.default.createElement("div", { className: "empty" }, dueView === "today" ? "No tasks due today" : dueView === "finished" ? "No finished tasks" : `No tasks in ${dueLabel}`)))))),
        react_1.default.createElement("div", { className: `panel${remainingPanelOpen ? " panel-open" : ""}${!remainingOpen ? " panel-collapsed" : ""}`, ref: remainingPanelRef },
            react_1.default.createElement("div", { className: "header" },
                react_1.default.createElement("div", { className: "section-title" },
                    react_1.default.createElement("div", { className: "section-left" },
                        addingListPanel === "inbox" ? (react_1.default.createElement("div", { className: "inline-rename" },
                            react_1.default.createElement("input", { type: "text", placeholder: "New list name", value: newListName, onChange: (e) => setNewListName(e.target.value), onKeyDown: (e) => {
                                    if (e.key === "Enter")
                                        commitAddList();
                                    if (e.key === "Escape") {
                                        setAddingListPanel(null);
                                        setNewListName("");
                                    }
                                }, onBlur: () => { if (newListName.trim())
                                    commitAddList();
                                else {
                                    setAddingListPanel(null);
                                    setNewListName("");
                                } }, autoFocus: true }))) : renamingListId && renamingListId === inboxView ? (react_1.default.createElement("div", { className: "inline-rename" },
                            react_1.default.createElement("input", { type: "text", value: renameValue, onChange: (e) => setRenameValue(e.target.value), onKeyDown: (e) => {
                                    if (e.key === "Enter")
                                        commitRename();
                                    if (e.key === "Escape") {
                                        setRenamingListId(null);
                                        setRenameValue("");
                                    }
                                }, onBlur: commitRename, autoFocus: true }))) : (react_1.default.createElement("button", { className: "section-switch", onClick: () => {
                                closeAllMenus();
                                setInboxViewMenuOpen(true);
                            }, "aria-label": "Choose list view" },
                            react_1.default.createElement("span", { className: "section-label" }, inboxLabel))),
                        react_1.default.createElement("button", { className: "section-collapse", onClick: () => setRemainingOpen(!remainingOpen), "aria-label": "Collapse list" },
                            react_1.default.createElement(shared_1.Icon, { name: remainingOpen ? "chevron-down" : "chevron-right" }))),
                    react_1.default.createElement("button", { className: "section-menu", onClick: () => {
                            closeAllMenus();
                            setRemainingMenuOpen(true);
                        }, "aria-label": "List options" },
                        react_1.default.createElement(shared_1.Icon, { name: "more-horizontal" })))),
            inboxViewMenuOpen && (react_1.default.createElement("div", { className: "inbox-view-menu" },
                react_1.default.createElement("button", { onClick: () => {
                        setInboxView("inbox");
                        closeAllMenus();
                    } }, "Inbox"),
                customLists.map((cl) => (react_1.default.createElement("button", { key: cl.id, onClick: () => {
                        setInboxView(cl.id);
                        closeAllMenus();
                    } }, cl.name))))),
            remainingMenuOpen && (react_1.default.createElement("div", { className: "list-menu" },
                react_1.default.createElement("button", { onClick: () => {
                        closeAllMenus();
                        toggleSettings();
                    } }, "Settings"),
                react_1.default.createElement("button", { onClick: () => {
                        activeListRef.current = 1;
                        removeCompleted(inboxList);
                        closeAllMenus();
                    } }, "Remove Finished Items"),
                react_1.default.createElement("button", { onClick: () => startAddList("inbox") }, "Add List"),
                inboxView !== "inbox" && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("button", { onClick: () => {
                            const list = customLists.find((l) => l.id === inboxView);
                            if (list)
                                startRenameList(list);
                        } }, "Rename List"),
                    react_1.default.createElement("button", { onClick: () => {
                            closeAllMenus();
                            deleteList(inboxView);
                        } }, "Delete List"))))),
            react_1.default.createElement("div", { className: "list", ref: remainingListRef, style: {
                    maxHeight: remainingOpen ? `${listCaps.remaining}px` : "0px",
                    overflowY: remainingOpen ? "auto" : "hidden",
                } }, remainingOpen && (react_1.default.createElement(react_1.default.Fragment, null, inboxList.length ? (renderItems(inboxList, 1, { showDue: true, showRepeat: true })) : (react_1.default.createElement("div", { className: "empty" }, inboxView === "inbox" ? "No remaining tasks" : `No tasks in ${inboxLabel}`))))),
            react_1.default.createElement("div", { className: "footer" },
                react_1.default.createElement("div", { className: "composer" },
                    react_1.default.createElement("input", { placeholder: "New Task", value: input, onChange: (event) => setInput(event.target.value), onFocus: () => setInputFocused(true), onBlur: () => setInputFocused(false), onKeyDown: (event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                handleAdd();
                            }
                        } }),
                    customLists.length > 0 && (react_1.default.createElement("div", { className: "list-picker" },
                        react_1.default.createElement("button", { className: `list-picker-toggle${showMenuToggle ? "" : " hidden-control"}`, onClick: () => {
                                closeAllMenus();
                                setListPickerOpen(!listPickerOpen);
                            }, tabIndex: showMenuToggle ? 0 : -1 },
                            selectedListId
                                ? (_j = (_h = customLists.find((l) => l.id === selectedListId)) === null || _h === void 0 ? void 0 : _h.name) !== null && _j !== void 0 ? _j : "Inbox"
                                : "Inbox",
                            react_1.default.createElement(shared_1.Icon, { name: "chevron-down", size: 12 })),
                        listPickerOpen && (react_1.default.createElement("div", { className: "list-picker-menu" },
                            react_1.default.createElement("button", { className: !selectedListId ? "active" : "", onClick: () => {
                                    setSelectedListId(undefined);
                                    setListPickerOpen(false);
                                } }, "Inbox"),
                            customLists.map((cl) => (react_1.default.createElement("button", { key: cl.id, className: selectedListId === cl.id ? "active" : "", onClick: () => {
                                    setSelectedListId(cl.id);
                                    setListPickerOpen(false);
                                } }, cl.name))))))),
                    react_1.default.createElement("button", { className: `due-today${showMenuToggle ? "" : " hidden-control"}`, onClick: () => handleAddWithDueDate(getYmd(new Date())), "aria-label": "Set due today", tabIndex: showMenuToggle ? 0 : -1 }, "Due Today"),
                    react_1.default.createElement("button", { className: `menu-toggle${menuOpen ? " open" : ""}${showMenuToggle ? "" : " hidden-control"}`, onClick: () => {
                            closeAllMenus();
                            setMenuOpen(true);
                        }, "aria-label": "Task options", tabIndex: showMenuToggle ? 0 : -1 },
                        react_1.default.createElement(shared_1.Icon, { name: "more-horizontal" }))),
                menuOpen &&
                    renderRepeatMenu(repeatType === "none"
                        ? undefined
                        : repeatType === "daily"
                            ? { type: "daily" }
                            : repeatType === "weekly"
                                ? { type: "weekly", days: customDays }
                                : { type: "custom", days: customDays }, (next) => {
                        var _a;
                        if (!next) {
                            setRepeatType("none");
                            setCustomDays([]);
                        }
                        else if (next.type === "daily") {
                            setRepeatType("daily");
                            setCustomDays([]);
                        }
                        else if (next.type === "weekly") {
                            setRepeatType("weekly");
                            setCustomDays((_a = next.days) !== null && _a !== void 0 ? _a : []);
                        }
                        else {
                            setRepeatType("custom");
                            setCustomDays(next.days);
                        }
                    }, dueDate, (next) => setDueDate(next), (next) => {
                        const submitted = submitTaskWithMeta(next);
                        if (!submitted && (next === null || next === void 0 ? void 0 : next.dueDate)) {
                            setDueDate(next.dueDate);
                        }
                        // Close menus without re-submitting (submitTaskWithMeta already handled it)
                        setMenuOpen(false);
                        setRemainingMenuOpen(false);
                        setDueListMenuOpen(false);
                        setDueViewMenuOpen(false);
                        setCompleteMenuId(null);
                        setItemMenuId(null);
                    })))));
};
exports.default = TodoPlus;
//# sourceMappingURL=TodoPlus.js.map