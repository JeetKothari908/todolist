import { useContext } from "react";
import { UiContext } from "../contexts/ui";
import { cache as cacheDb, db } from "../db/state";
import { useKey } from "../lib/db/react";
import { API } from "../plugins";

// TODO: consider alternative ways to supply api that isn't eager loading
//       the entire object for every plugin
export function useApi(id: string, key?: string): API {
  // Cache
  const [cache, setCache] = useKey(cacheDb, id);

  // Data
  const [data, setData] = useKey(db, `data/${id}`);
  const stableDataKey = (
    key && key !== id ? `data/${key}` : `data/${id}`
  ) as `data/${string}`;
  const [stableData, setStableData] = useKey(db, stableDataKey);
  const activeData = pickWidgetData(key, data, stableData);

  // Loader
  const { pushLoader, popLoader } = useContext(UiContext);
  const loader = { push: pushLoader, pop: popLoader };
  const saveData = (nextData: unknown) => {
    setData(nextData);
    if (stableDataKey !== `data/${id}`) setStableData(nextData);
  };

  return {
    cache,
    data: activeData,
    loader,
    setCache,
    setData: saveData,
  };
}

const pickWidgetData = (key: string | undefined, current: unknown, stable: unknown) =>
  widgetDataScore(key, stable) > widgetDataScore(key, current) ? stable : current;

const widgetDataScore = (key: string | undefined, data: unknown): number => {
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
