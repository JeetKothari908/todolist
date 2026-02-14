import React, { useState, useEffect } from "react";
import { selectWidgets } from "../../db/select";
import { db, WidgetPosition, WidgetState } from "../../db/state";
import { useSelector, useValue } from "../../lib/db/react";
import Slot from "./Slot";
import "./Widgets.sass";

/** Returns true when the browser window is maximized or in F11 fullscreen. */
function useIsWindowMaximized() {
  const check = () => {
    // F11 fullscreen
    if (document.fullscreenElement) return true;
    // On Windows, a maximized window's outerWidth/outerHeight match or
    // slightly exceed screen.availWidth/availHeight (invisible borders).
    // Use a tolerance to account for that.
    const tolerance = 30;
    return (
      window.outerWidth >= screen.availWidth - tolerance &&
      window.outerHeight >= screen.availHeight - tolerance
    );
  };

  const [maximized, setMaximized] = useState(check);

  useEffect(() => {
    const update = () => setMaximized(check());
    window.addEventListener("resize", update);
    document.addEventListener("fullscreenchange", update);
    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("fullscreenchange", update);
    };
  }, []);

  return maximized;
}

const Widgets: React.FC = () => {
  const focus = useValue(db, "focus");
  const isFullscreen = useIsWindowMaximized();
  const allWidgets = useSelector(db, selectWidgets);

  // Only show the todo widget when the window is fullscreen / maximized
  const widgets = allWidgets.filter(
    (widget) => widget.key !== "widget/todo" || isFullscreen,
  );

  // TODO: one day we'll have `Array.groupBy` accepted by tc39
  const grouped = widgets.reduce<
    Partial<Record<WidgetPosition, WidgetState[]>>
  >(
    (carry, widget) => ({
      ...carry,
      [widget.display.position]: [
        ...(carry[widget.display.position] ?? []),
        widget,
      ],
    }),
    {},
  );

  const slots = Object.entries(grouped) as [WidgetPosition, WidgetState[]][];

  return (
    <div className="Widgets fullscreen">
      <div className="container">
        {!focus &&
          slots.map(([position, widgets]) => (
            <Slot key={position} position={position} widgets={widgets} />
          ))}
      </div>
    </div>
  );
};

export default Widgets;
