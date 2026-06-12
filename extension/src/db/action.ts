import { nanoid } from "nanoid";
import { DB } from "../lib";
import migrateFrom2 from "./migrations/migrate2";
import { selectWidgets } from "./select";
import { cache, db, WidgetDisplay, WidgetPosition } from "./state";

export const createId = (): string => nanoid(12);

// Background actions

/** Change the background */
export const setBackground = (key: string): void => {
  const current = DB.get(db, "background");
  const id = createId();
  DB.put(db, "background", {
    id,
    key,
    display: { blur: 0, luminosity: -0.2 },
  });
  DB.del(db, `data/${current.id}`);
  DB.del(cache, current.id);
};

// Widget actions

/** Add a new widget */
export const addWidget = (key: string): void => {
  removeMutuallyExclusiveWidgets(key);
  ensureSingletonWidget(key);

  const id = singletonWidgetId(key) ?? createId();
  const widgets = selectWidgets();
  const order = widgets.length > 0 ? widgets[widgets.length - 1].order + 1 : 0;
  DB.put(db, `widget/${id}`, {
    id,
    key,
    order,
    display: { position: defaultWidgetPosition(key) },
  });
  recoverSingletonData(key, id);
};

const defaultWidgetPosition = (key: string): WidgetPosition => {
  switch (key) {
    case "widget/notes":
    case "widget/planOfDay":
      return "middleLeft";
    case "widget/todo":
      return "bottomRight";
    default:
      return "middleCentre";
  }
};

const exclusiveWidgetGroups: string[][] = [];

const singletonWidgetId = (key: string): string | null => {
  switch (key) {
    case "widget/todo":
      return "default-todo";
    case "widget/notes":
      return "default-notes";
    case "widget/planOfDay":
      return "default-plan-of-day";
    default:
      return null;
  }
};

export const ensureSingletonWidget = (key: string): void => {
  const id = singletonWidgetId(key);
  if (!id) return;

  const widgets = selectWidgets().filter((widget) => widget.key === key);
  const singleton = widgets.find((widget) => widget.id === id);
  const source = singleton ?? widgets[0];

  if (source && source.id !== id) {
    DB.put(db, `widget/${id}`, { ...source, id });
    moveWidgetData(source.id, id, key);
    DB.put(db, `widget/${source.id}`, null);
  }

  widgets
    .filter((widget) => widget.id !== id && widget.id !== source?.id)
    .forEach((widget) => {
      moveWidgetData(widget.id, id, key);
      DB.put(db, `widget/${widget.id}`, null);
    });

  recoverSingletonData(key, id);
};

const moveWidgetData = (fromId: string, toId: string, key: string): void => {
  const fromData = DB.get(db, `data/${fromId}`);
  const toData = DB.get(db, `data/${toId}`);

  if (shouldReplaceWidgetData(key, toData, fromData)) {
    DB.put(db, `data/${toId}`, fromData);
  }

  DB.del(db, `data/${fromId}`);

  const fromCache = DB.get(cache, fromId);
  if (fromCache !== undefined && DB.get(cache, toId) === undefined) {
    DB.put(cache, toId, fromCache);
  }
  DB.del(cache, fromId);
};

const recoverSingletonData = (key: string, id: string): void => {
  const currentData = DB.get(db, `data/${id}`);
  const recovered = Array.from(DB.prefix(db, "data/"))
    .filter(([dataKey]) => dataKey !== `data/${id}`)
    .map(([dataKey, data]) => ({
      dataKey,
      data,
      score: widgetDataScore(key, data),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (recovered && shouldReplaceWidgetData(key, currentData, recovered.data)) {
    DB.put(db, `data/${id}`, recovered.data);
    DB.del(db, recovered.dataKey);
  }
};

const shouldReplaceWidgetData = (
  key: string,
  currentData: unknown,
  nextData: unknown,
): boolean =>
  nextData !== undefined && widgetDataScore(key, nextData) > widgetDataScore(key, currentData);

const widgetDataScore = (key: string, data: unknown): number => {
  if (!data || typeof data !== "object") return 0;

  switch (key) {
    case "widget/notes": {
      const items = (data as { items?: unknown }).items;
      return Array.isArray(items) ? items.length : 0;
    }
    case "widget/planOfDay": {
      const plans = (data as { plans?: unknown }).plans;
      if (!plans || typeof plans !== "object" || Array.isArray(plans)) return 0;
      return Object.values(plans).filter(
        (plan) => typeof plan === "string" && plan.trim() !== "",
      ).length;
    }
    default:
      return 0;
  }
};

const removeMutuallyExclusiveWidgets = (key: string): void => {
  const group = exclusiveWidgetGroups.find((keys) => keys.includes(key));
  if (!group) return;

  selectWidgets()
    .filter((widget) => group.includes(widget.key) && widget.key !== key)
    .forEach((widget) => removeWidget(widget.id));
};

/** Remove a widget */
export const removeWidget = (id: string): void => {
  const widget = DB.get(db, `widget/${id}`);
  DB.put(db, `widget/${id}`, null);
  if (widget && singletonWidgetId(widget.key)) return;
  DB.del(db, `data/${id}`);
  DB.del(cache, id);
};

/** Reorder a widget */
export const reorderWidget = (from: number, to: number): void => {
  const widgets = selectWidgets();
  widgets.splice(to, 0, widgets.splice(from, 1)[0]);
  widgets.forEach((widget, order) =>
    DB.put(db, `widget/${widget.id}`, { ...widget, order }),
  );
};

/** Set display properties of a widget */
export const setWidgetDisplay = (
  id: string,
  display: Partial<WidgetDisplay>,
) => {
  const widget = DB.get(db, `widget/${id}`);
  if (!widget) throw new Error("Widget not found while");
  DB.put(db, `widget/${id}`, {
    ...widget,
    display: { ...widget.display, ...display },
  });
};

// UI actions

/** Toggle dashboard focus mode */
export const toggleFocus = () => {
  DB.put(db, "focus", !DB.get(db, "focus"));
};

// Store actions

/** Import database from a dump */
export const importStore = (dump: any): void => {
  // TODO: Add proper schema validation
  if (typeof dump !== "object" || dump === null)
    throw new TypeError("Unexpected format");

  resetStore();
  if ("backgrounds" in dump) {
    // Version 2 config
    DB.put(db, `widget/default-time`, null);
    DB.put(db, `widget/default-greeting`, null);
    dump = migrateFrom2(dump);
  } else if (dump.version === 3) {
    // Version 3 config
    delete dump.version;
  } else if (dump.version > 3) {
    // Future version
    throw new TypeError("Settings exported from an newer version of LocalFlow");
  } else {
    // Unknown version
    throw new TypeError("Unknown settings version");
  }
  // @ts-ignore
  Object.entries(dump).forEach(([key, val]) => DB.put(db, key, val));
};

/** Export a database dump */
export const exportStore = (): string => {
  return JSON.stringify({
    ...Object.fromEntries(DB.prefix(db, "")),
    version: 3,
  });
};

/** Reset the database */
export const resetStore = (): void => {
  clear(db);
  clear(cache);
};

const clear = (db: DB.Database): void => {
  // @ts-ignore
  for (const [key] of DB.prefix(db, "")) DB.del(db, key);
};
