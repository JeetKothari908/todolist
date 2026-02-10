import css from "./css";
import greeting from "./greeting";
import js from "./js";
import links from "./links";
import message from "./message";
import notes from "./notes";
import time from "./time";
import todo from "./todo-plus";
import workHours from "./workHours";

export const widgetConfigs = [
  css,
  greeting,
  links,
  message,
  notes,
  time,
  todo,
  workHours,
];

if (BUILD_TARGET === "web") {
  widgetConfigs.push(js);
}

widgetConfigs.sort((a, b) => a.name.localeCompare(b.name));
