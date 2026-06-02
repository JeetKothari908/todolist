import { backgroundConfigs } from "./backgrounds";
import { widgetConfigs } from "./widgets";

export { backgroundConfigs } from "./backgrounds";
export { widgetConfigs } from "./widgets";

const configs = [...backgroundConfigs, ...widgetConfigs];

export function getConfig(key: string) {
  const config = getConfigSafe(key);
  if (!config) throw new Error(`Unable to find config for plugin: ${key}`);
  return config;
}

export function getConfigSafe(key: string) {
  return configs.find((config) => config.key === key) ?? null;
}
