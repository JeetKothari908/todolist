export interface SyncSettings {
  enabled: boolean;
  url: string;
  token: string;
}

type Listener = () => void;

const key = "todo-sync/settings";
const listeners = new Set<Listener>();

let settings: SyncSettings = {
  enabled: false,
  url: SYNC_SERVER_URL || "",
  token: SYNC_AUTH_TOKEN || "",
};
let saveQueue = Promise.resolve();

const isSyncSettings = (value: unknown): value is Partial<SyncSettings> =>
  typeof value === "object" && value !== null;

const normalizeSettings = (value: unknown): SyncSettings => {
  const next = isSyncSettings(value) ? value : {};

  return {
    enabled: next.enabled === true,
    url: typeof next.url === "string" ? next.url : settings.url,
    token: typeof next.token === "string" ? next.token : settings.token,
  };
};

const canUseExtensionStorage = () =>
  BUILD_TARGET !== "web" &&
  typeof browser !== "undefined" &&
  Boolean(browser.storage?.local);

export const syncSettingsReady = (async () => {
  try {
    if (canUseExtensionStorage()) {
      const stored = await browser.storage.local.get(key);
      settings = normalizeSettings(stored[key]);
      return;
    }

    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(key);
      if (stored) settings = normalizeSettings(JSON.parse(stored));
    }
  } catch (error) {
    console.error("[todo-sync] cannot read sync settings", error);
  } finally {
    listeners.forEach((listener) => listener());
  }
})();

export const getSyncSettings = (): SyncSettings => settings;

export const setSyncSettings = async (
  next: Partial<SyncSettings>,
): Promise<void> => {
  settings = normalizeSettings({ ...settings, ...next });
  const snapshot = settings;
  listeners.forEach((listener) => listener());

  const save = async () => {
    if (canUseExtensionStorage()) {
      await browser.storage.local.set({ [key]: snapshot });
    } else {
      if (typeof window !== "undefined")
        window.localStorage.setItem(key, JSON.stringify(snapshot));
    }
  };

  try {
    saveQueue = saveQueue.then(save, save);
    await saveQueue;
  } catch (error) {
    console.error("[todo-sync] cannot save sync settings", error);
    throw error;
  }
};

export const subscribeSyncSettings = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
