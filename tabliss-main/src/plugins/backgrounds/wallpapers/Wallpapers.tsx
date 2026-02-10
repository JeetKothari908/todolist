import React from "react";
import { useTime } from "../../../hooks";
import Backdrop from "../../../views/shared/Backdrop";
import "./Wallpapers.sass";

import wallpaper1 from "../../../assets/wallpapers/wallpaper-1.jpg";
import wallpaper2 from "../../../assets/wallpapers/wallpaper-2.jpg";
import wallpaper3 from "../../../assets/wallpapers/wallpaper-3.jpg";
import wallpaper4 from "../../../assets/wallpapers/wallpaper-4.jpg";
import wallpaper5 from "../../../assets/wallpapers/wallpaper-5.jpg";
import wallpaper6 from "../../../assets/wallpapers/wallpaper-6.jpg";
import wallpaper7 from "../../../assets/wallpapers/wallpaper-7.jpg";

const wallpapers = [
  wallpaper1,
  wallpaper2,
  wallpaper3,
  wallpaper4,
  wallpaper5,
  wallpaper6,
  wallpaper7,
];

const Wallpapers: React.FC = () => {
  const index = React.useMemo(() => {
    const key = "tabliss.wallpapers.index";
    const existing = sessionStorage.getItem(key);
    if (existing !== null) {
      const parsed = Number(existing);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < wallpapers.length) {
        return parsed;
      }
    }
    const next = Math.floor(Math.random() * wallpapers.length);
    sessionStorage.setItem(key, String(next));
    return next;
  }, []);
  const url = wallpapers[index];

  return (
    <Backdrop
      className="Wallpapers fullscreen"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
};

export default Wallpapers;
