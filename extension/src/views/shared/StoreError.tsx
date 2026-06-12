import React from "react";
import Modal from "./modal/Modal";

type Props = {
  onClose: () => void;
};

const StoreError: React.FC<Props> = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className="Settings">
        <h2 style={{ margin: 0 }}>Storage Error</h2>
        <p style={{ fontSize: "1.25em" }}>
          LocalFlow is unable to load or save settings. This is most commonly
          caused by running in private browsing mode; but low disk space or a
          corrupt browser profile can also be the problem.
        </p>
        <p>
          If you have settings saved with LocalFlow, it might be a temporary
          issue. Try restarting your browser and checking if your settings
          return.
        </p>
        <p>
          If they do not return, try exporting any available settings and
          restarting the browser profile before making more changes.
        </p>
        <div className="Modal-footer">
          <a
            className="button button--primary"
            href="https://github.com/JeetKothari908/LocalFlow"
            style={{ fontSize: "1.1em" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default StoreError;
