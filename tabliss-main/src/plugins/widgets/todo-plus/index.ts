import { Config } from "../../types";
import TodoPlus from "./TodoPlus";
import TodoSettings from "../todo/TodoSettings";

const config: Config = {
  key: "widget/todo",
  name: "Tasks",
  description: "Momentum-style task list.",
  dashboardComponent: TodoPlus,
  settingsComponent: TodoSettings,
};

export default config;
