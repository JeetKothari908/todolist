import React from "react";
import { db } from "../../db/state";
import { useValue } from "../../lib/db/react";
import { setBackground } from "../../db/action";
import { getConfigSafe } from "../../plugins";
import Plugin from "../shared/Plugin";

const Background: React.FC = () => {
  const background = useValue(db, "background");

  const config = getConfigSafe(background.key);

  React.useEffect(() => {
    if (!config) {
      setBackground("background/wallpapers");
    }
  }, [config]);

  if (!config) return null;

  return (
    <div className="Background">
      <Plugin id={background.id} component={config.dashboardComponent} />
    </div>
  );
};

export default Background;
