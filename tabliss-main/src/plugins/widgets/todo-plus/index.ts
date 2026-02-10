import { Config } from "../../types";
import TodoPlus from "./TodoPlus";

const config: Config = {
  key: "widget/todo",
  name: "Tasks",
  description: "Momentum-style task list.",
  dashboardComponent: TodoPlus,
};

export default config;
