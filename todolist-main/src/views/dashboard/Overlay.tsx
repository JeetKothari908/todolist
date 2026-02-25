import React from "react";
import { defineMessages } from "react-intl";
import { ErrorContext } from "../../contexts/error";
import { UiContext } from "../../contexts/ui";
import { useFormatMessages, useKeyPress } from "../../hooks";
import { Icon } from "../shared";
import "./Overlay.sass";

const messages = defineMessages({
  settingsHint: {
    id: "dashboard.settingsHint",
    defaultMessage: "Customise Tabliss",
    description: "Hover hint text for the settings icon",
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
  const { errors } = React.useContext(ErrorContext);
  const { pending, toggleErrors, toggleSettings } = React.useContext(UiContext);

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
    </div>
  );
};

export default Overlay;
