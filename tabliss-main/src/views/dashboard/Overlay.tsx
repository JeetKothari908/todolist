import React from "react";
import { defineMessages } from "react-intl";
import { ErrorContext } from "../../contexts/error";
import { UiContext } from "../../contexts/ui";
import { toggleFocus } from "../../db/action";
import { db } from "../../db/state";
import { useFormatMessages, useKeyPress } from "../../hooks";
import { useValue } from "../../lib/db/react";
import { Icon } from "../shared";
import "./Overlay.sass";

const messages = defineMessages({
  settingsHint: {
    id: "dashboard.settingsHint",
    defaultMessage: "Customise Tabliss",
    description: "Hover hint text for the settings icon",
  },
  focusHint: {
    id: "dashboard.focusHint",
    defaultMessage: "Toggle widgets",
    description: "Hover hint text for the widgets toggle",
  },
  loadingHint: {
    id: "dashboard.loadingHint",
    defaultMessage: "Loading new content",
    description:
      "Hover hint text for the loading indicator icon (the lightning bolt)",
  },
  errorHint: {
    id: "dashboard.errorHint",
    defaultMessage: "Show errors",
    description: "Hover hint text for the error indicator icon",
  },
});

const Overlay: React.FC = () => {
  const translated = useFormatMessages(messages);
  const focus = useValue(db, "focus");
  const { errors } = React.useContext(ErrorContext);
  const { pending, toggleErrors, toggleSettings } = React.useContext(UiContext);

  useKeyPress(toggleFocus, ["w"]);
  useKeyPress(toggleSettings, ["s"]);

  return (
    <div className="Overlay">
      <a onClick={toggleSettings} title={`${translated.settingsHint} (S)`}>
        <Icon name="settings" />
      </a>

      {errors.length > 0 ? (
        <a onClick={toggleErrors} title={translated.errorHint}>
          <Icon name="alert-triangle" />
        </a>
      ) : null}

      {pending > 0 ? (
        <span title={translated.loadingHint}>
          <Icon name="zap" />
        </span>
      ) : null}

      <a
        className={focus ? "" : "on-hover"}
        onClick={toggleFocus}
        title={`${translated.focusHint} (W)`}
      >
        <Icon name={focus ? "eye-off" : "eye"} />
      </a>
    </div>
  );
};

export default Overlay;
