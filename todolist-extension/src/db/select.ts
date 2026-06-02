import { DB } from "../lib";
import { db, WidgetState } from "./state";

/** Select widgets from database */
export const selectWidgets = (): WidgetState[] => {
  return Array.from(DB.prefix(db, "widget/"))
    .map(([, val]) => val)
    .filter(
      (val): val is WidgetState =>
        val !== null &&
        typeof val === "object" &&
        typeof val.id === "string" &&
        typeof val.key === "string" &&
        typeof val.order === "number" &&
        typeof val.display === "object" &&
        val.display !== null,
    )
    .sort((a, b) => a.order - b.order);
};
