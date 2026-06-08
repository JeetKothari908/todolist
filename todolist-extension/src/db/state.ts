import { DB, Storage, Stream } from "../lib";
import { defaultLocale } from "../locales";
import {
  getSyncSettings,
  subscribeSyncSettings,
  SyncSettings,
  syncSettingsReady,
} from "./syncSettings";

/**
 * Database state
 */
export interface State {
  /** Background state */
  background: BackgroundState;
  /** Widget state */
  [key: `widget/${string}`]: WidgetState | null;
  /** Plugin data */
  [key: `data/${string}`]: unknown;
  /** Whether focus has been activated */
  focus: boolean;
  /** Locale selected */
  locale: string;
  /** Time zone selected, if any */
  timeZone: string | null;
  /** Whether the quotes widget is shown */
  showQuotes: boolean;
}

export interface BackgroundState {
  id: string;
  key: string;
  display: BackgroundDisplay;
}

export interface BackgroundDisplay {
  blur?: number;
  luminosity?: number;
}

export interface WidgetState {
  id: string;
  key: string;
  order: number;
  display: WidgetDisplay;
}

export interface WidgetDisplay {
  colour?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  position: WidgetPosition;
}

export type WidgetPosition =
  | "topLeft"
  | "topCentre"
  | "topRight"
  | "middleLeft"
  | "middleCentre"
  | "middleRight"
  | "bottomLeft"
  | "bottomCentre"
  | "bottomRight";

// Init data for the store
const initData: State = {
  background: {
    id: "default-wallpapers",
    key: "background/wallpapers",
    display: {
      luminosity: -0.2,
      blur: 0,
    },
  },
  "widget/default-time": {
    id: "default-time",
    key: "widget/time",
    order: 0,
    display: {
      position: "middleCentre",
    },
  },
  "widget/default-search": {
    id: "default-search",
    key: "widget/search",
    order: 1,
    display: {
      position: "middleCentre",
    },
  },
  "widget/default-quote": {
    id: "default-quote",
    key: "widget/quote",
    order: 2,
    display: {
      position: "middleCentre",
    },
  },
  "widget/default-todo": {
    id: "default-todo",
    key: "widget/todo",
    order: 3,
    display: {
      position: "bottomRight",
    },
  },
  focus: false,
  locale: defaultLocale,
  timeZone: null,
  showQuotes: true,
};

// Database storage
export const db = DB.init<State>(initData);

// Cache storage
export const cache = DB.init<Record<string, unknown | undefined>>();

// Persist data
const localDbStorage =
  BUILD_TARGET === "web"
    ? Storage.indexeddb(db, "tabliss/config")
    : Storage.extensionLocal(db, "tabliss/config");

export const syncErrors = Stream.init<Error>();

let stopRemoteSync: (() => void) | null = null;
let remoteSyncGeneration = 0;

const configureRemoteSync = async (settings: SyncSettings): Promise<void> => {
  remoteSyncGeneration += 1;
  const generation = remoteSyncGeneration;

  if (stopRemoteSync) {
    stopRemoteSync();
    stopRemoteSync = null;
  }

  const url = settings.url.trim();
  if (!settings.enabled) {
    console.info("[todo-sync] disabled in settings");
    return;
  }

  if (!url) {
    console.info("[todo-sync] disabled: sync server URL is empty");
    return;
  }

  console.info("[todo-sync] enabled:", url);

  const remoteErrors = await Storage.remoteSync(db, "tabliss/config", {
    url,
    token: settings.token.trim() || undefined,
  });

  if (generation !== remoteSyncGeneration) {
    remoteErrors.stop();
    return;
  }

  const unsubscribeErrors = Stream.subscribe(remoteErrors, (error) =>
    Stream.publish(syncErrors, error),
  );

  stopRemoteSync = () => {
    unsubscribeErrors();
    remoteErrors.stop();
  };
};

export const dbStorage = localDbStorage.then(async (localErrors) => {
  await syncSettingsReady;
  configureRemoteSync(getSyncSettings());
  subscribeSyncSettings(() => configureRemoteSync(getSyncSettings()));

  return localErrors;
});

export const cacheStorage =
  BUILD_TARGET === "firefox"
    ? Storage.extension(cache, "tabliss/cache", "local")
    : Storage.indexeddb(cache, "tabliss/cache");
