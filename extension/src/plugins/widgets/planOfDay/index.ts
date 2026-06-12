import { Config } from "../../types";
import PlanOfDay from "./PlanOfDay";

const config: Config = {
  key: "widget/planOfDay",
  name: "Plan of the Day",
  description: "Write the plan for today.",
  dashboardComponent: PlanOfDay,
};

export default config;
