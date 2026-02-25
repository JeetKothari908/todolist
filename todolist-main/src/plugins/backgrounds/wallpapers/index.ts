import { Config } from "../../types";
import Wallpapers from "./Wallpapers";

const config: Config = {
  key: "background/wallpapers",
  name: "Wallpapers",
  description: "Local wallpaper set.",
  dashboardComponent: Wallpapers,
  supportsBackdrop: true,
};

export default config;
