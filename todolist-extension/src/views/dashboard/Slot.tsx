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

  const priority = (key: string) => {
    if (position === "middleCentre") {
      if (key === "widget/time") return 0;
      if (key === "widget/search") return 1;
    }
    return 2;
  };

  const orderedWidgets = [...widgets].sort((a, b) => {
    const pa = priority(a.key);
    const pb = priority(b.key);
    if (pa !== pb) return pa - pb;
    return a.order - b.order;
  });

  return (
    <div className={`Slot ${position}`}>
      {orderedWidgets.map(({ display, id, key }) => {
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
