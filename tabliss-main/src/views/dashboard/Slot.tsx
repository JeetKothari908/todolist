import React from "react";
import { WidgetPosition, WidgetState } from "../../db/state";
import { removeWidget } from "../../db/action";
import { getConfigSafe } from "../../plugins";
import Plugin from "../shared/Plugin";
import "./Slot.sass";
import Widget from "./Widget";

type Props = {
  position: WidgetPosition;
  widgets: WidgetState[];
};

const Slot: React.FC<Props> = ({ position, widgets }) => {
  const invalidIds = widgets
    .filter((widget) => !getConfigSafe(widget.key))
    .map((widget) => widget.id);

  React.useEffect(() => {
    invalidIds.forEach((id) => removeWidget(id));
  }, [invalidIds.join(",")]);

  return (
    <div className={`Slot ${position}`}>
      {widgets.map(({ display, id, key }) => {
        const config = getConfigSafe(key);
        if (!config) return null;
        return (
          <Widget key={id} {...display}>
            <Plugin id={id} component={config.dashboardComponent} />
          </Widget>
        );
      })}
    </div>
  );
};

export default Slot;
