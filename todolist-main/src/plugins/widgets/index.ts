import css from "./css";
import greeting from "./greeting";
import js from "./js";
import links from "./links";
import message from "./message";
import notes from "./notes";
import quote from "./quote";
import search from "./search";
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
  search,
  quote,
  todo,
  workHours,
];

if (BUILD_TARGET === "web") {
  widgetConfigs.push(js);
}
