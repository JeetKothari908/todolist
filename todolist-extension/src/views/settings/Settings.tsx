import React from "react";
import { FormattedMessage } from "react-intl";
import { UiContext } from "../../contexts/ui";
import {
  addWidget,
  exportStore,
  importStore,
  removeWidget,
  resetStore,
  setWidgetDisplay,
} from "../../db/action";
import { selectWidgets } from "../../db/select";
import { db, WidgetPosition } from "../../db/state";
import { useKeyPress } from "../../hooks";
import { useKey, useSelector } from "../../lib/db/react";
import Background from "./Background";
import "./Settings.sass";
import System from "./System";

type SideFeatureKey = "widget/todo" | "widget/notes" | "widget/planOfDay";
type Side = "left" | "right";

const sideFeatures: { key: SideFeatureKey; name: string }[] = [
  { key: "widget/todo", name: "Todos" },
  { key: "widget/notes", name: "Notes" },
  { key: "widget/planOfDay", name: "Plan of the Day" },
];

const sidePositions: Record<Side, WidgetPosition> = {
  left: "middleLeft",
  right: "bottomRight",
};

const Settings: React.FC = () => {
  const { toggleSettings } = React.useContext(UiContext);
  const [showQuotes, setShowQuotes] = useKey(db, "showQuotes");
  const widgets = useSelector(db, selectWidgets);

  const getSideFeature = (side: Side) =>
    widgets.find(
      (widget) =>
        sideFeatures.some((feature) => feature.key === widget.key) &&
        widget.display.position === sidePositions[side],
    )?.key ?? "";

  const setSideFeature = (side: Side, nextKey: "" | SideFeatureKey) => {
    const position = sidePositions[side];
    const selectedSideKeys = new Set(
      (["left", "right"] as Side[])
        .filter((item) => item !== side)
        .map((item) => getSideFeature(item))
        .filter(Boolean),
    );

    widgets
      .filter(
        (widget) =>
          sideFeatures.some((feature) => feature.key === widget.key) &&
          widget.display.position === position &&
          widget.key !== nextKey,
      )
      .forEach((widget) => removeWidget(widget.id));

    widgets
      .filter(
        (widget) =>
          sideFeatures.some((feature) => feature.key === widget.key) &&
          !selectedSideKeys.has(widget.key) &&
          widget.key !== nextKey,
      )
      .forEach((widget) => removeWidget(widget.id));

    if (!nextKey) return;

    let widget = widgets.find((item) => item.key === nextKey);
    if (!widget) {
      addWidget(nextKey);
      widget = selectWidgets().find((item) => item.key === nextKey);
    }

    if (widget) setWidgetDisplay(widget.id, { position });
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to delete all of your Tabliss settings? This cannot be undone.",
      )
    )
      resetStore();
  };

  const handleExport = () => {
    const json = exportStore();
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" }),
    );

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "tabliss.json";
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style.display = "none";
    input.type = "file";
    input.addEventListener("change", function () {
      if (this.files) {
        const file = this.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          if (event.target && event.target.result) {
            try {
              const state = JSON.parse(event.target.result as string);
              importStore(state);
            } catch (error) {
              alert(
                `Invalid import file: ${
                  error instanceof Error ? error.message : "Uknown error"
                }`,
              );
            }
          }
        });
        reader.readAsText(file);
      }
      document.body.removeChild(input);
    });
    input.click();
  };

  useKeyPress(toggleSettings, ["Escape"]);

  return (
    <div className="Settings">
      <a onClick={toggleSettings} className="fullscreen" />

      <div className="plane">
        <Background />

        <System />

        <h2>Widgets</h2>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showQuotes}
            onChange={() => setShowQuotes(!showQuotes)}
          />
          Quotes
        </label>
        <div className="side-layout">
          {(["left", "right"] as Side[]).map((side) => {
            const otherSide = side === "left" ? "right" : "left";
            const otherValue = getSideFeature(otherSide);
            return (
              <label key={side}>
                {side === "left" ? "Left side" : "Right side"}
                <select
                  value={getSideFeature(side)}
                  onChange={(event) =>
                    setSideFeature(
                      side,
                      event.target.value as "" | SideFeatureKey,
                    )
                  }
                >
                  <option value="">None</option>
                  {sideFeatures.map((feature) => (
                    <option
                      key={feature.key}
                      value={feature.key}
                      disabled={otherValue === feature.key}
                    >
                      {feature.name}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>

        <p style={{ marginBottom: "2rem" }}>
          <a onClick={handleImport}>Import</a>,{" "}
          <a onClick={handleExport}>export</a> or{" "}
          <a onClick={handleReset}>reset</a> your settings
        </p>

        <FormattedMessage
          id="settings.translationCredits"
          description="Give yourself some credit :)"
          defaultMessage=" "
          tagName="p"
        />
      </div>
    </div>
  );
};

export default React.memo(Settings);
