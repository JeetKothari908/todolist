import React from "react";
import { useTime } from "../../../hooks";
import Backdrop from "../../../views/shared/Backdrop";
import "./Wallpapers.sass";

// All wallpapers sourced from Unsplash (https://unsplash.com)
// Unsplash License: free for commercial and non-commercial use

// Architecture & Buildings
import wallpaper1 from "../../../assets/wallpapers/unsplash-architecture-modern-building-2560x1440.jpg";
import wallpaper2 from "../../../assets/wallpapers/unsplash-architecture-glass-skyscraper-2560x1440.jpg";
import wallpaper3 from "../../../assets/wallpapers/unsplash-architecture-white-concrete-2560x1440.jpg";
import wallpaper4 from "../../../assets/wallpapers/unsplash-architecture-cathedral-interior-2560x1440.jpg";

// Bridges
import wallpaper5 from "../../../assets/wallpapers/unsplash-bridge-golden-gate-fog-2560x1440.jpg";
import wallpaper6 from "../../../assets/wallpapers/unsplash-bridge-suspension-night-2560x1440.jpg";
import wallpaper7 from "../../../assets/wallpapers/unsplash-bridge-old-stone-2560x1440.jpg";

// City Skylines
import wallpaper8 from "../../../assets/wallpapers/unsplash-city-skyline-sunset-2560x1440.jpg";
import wallpaper9 from "../../../assets/wallpapers/unsplash-city-skyline-night-lights-2560x1440.jpg";
import wallpaper10 from "../../../assets/wallpapers/unsplash-city-aerial-daytime-2560x1440.jpg";
import wallpaper11 from "../../../assets/wallpapers/unsplash-city-downtown-evening-2560x1440.jpg";
import wallpaper12 from "../../../assets/wallpapers/unsplash-city-waterfront-reflection-2560x1440.jpg";

// Landmarks
import wallpaper13 from "../../../assets/wallpapers/unsplash-landmark-eiffel-tower-2560x1440.jpg";
import wallpaper14 from "../../../assets/wallpapers/unsplash-landmark-colosseum-2560x1440.jpg";
import wallpaper15 from "../../../assets/wallpapers/unsplash-landmark-taj-mahal-2560x1440.jpg";
import wallpaper16 from "../../../assets/wallpapers/unsplash-landmark-big-ben-2560x1440.jpg";

// Nature & Scenic
import wallpaper17 from "../../../assets/wallpapers/unsplash-nature-mountain-lake-2560x1440.jpg";
import wallpaper18 from "../../../assets/wallpapers/unsplash-nature-forest-mist-2560x1440.jpg";
import wallpaper19 from "../../../assets/wallpapers/unsplash-nature-ocean-coast-2560x1440.jpg";
import wallpaper20 from "../../../assets/wallpapers/unsplash-nature-northern-lights-2560x1440.jpg";
import wallpaper21 from "../../../assets/wallpapers/unsplash-nature-autumn-road-2560x1440.jpg";
import wallpaper22 from "../../../assets/wallpapers/unsplash-nature-snowy-mountains-2560x1440.jpg";

// Scenic / Travel
import wallpaper23 from "../../../assets/wallpapers/unsplash-scenic-santorini-2560x1440.jpg";
import wallpaper24 from "../../../assets/wallpapers/unsplash-scenic-venice-canal-2560x1440.jpg";
import wallpaper25 from "../../../assets/wallpapers/unsplash-scenic-japanese-temple-2560x1440.jpg";
import wallpaper26 from "../../../assets/wallpapers/unsplash-scenic-swiss-village-2560x1440.jpg";

// Night / Moody
import wallpaper27 from "../../../assets/wallpapers/unsplash-night-starry-sky-2560x1440.jpg";
import wallpaper28 from "../../../assets/wallpapers/unsplash-night-city-rain-2560x1440.jpg";

// Winter / Snow
import wallpaper29 from "../../../assets/wallpapers/unsplash-winter-cabin-snow-2560x1440.jpg";
import wallpaper30 from "../../../assets/wallpapers/unsplash-winter-frozen-lake-2560x1440.jpg";

const wallpapers = [
  wallpaper1,
  wallpaper2,
  wallpaper3,
  wallpaper4,
  wallpaper5,
  wallpaper6,
  wallpaper7,
  wallpaper8,
  wallpaper9,
  wallpaper10,
  wallpaper11,
  wallpaper12,
  wallpaper13,
  wallpaper14,
  wallpaper15,
  wallpaper16,
  wallpaper17,
  wallpaper18,
  wallpaper19,
  wallpaper20,
  wallpaper21,
  wallpaper22,
  wallpaper23,
  wallpaper24,
  wallpaper25,
  wallpaper26,
  wallpaper27,
  wallpaper28,
  wallpaper29,
  wallpaper30,
];

const Wallpapers: React.FC = () => {
  const time = useTime("absolute");
  const dayIndex = Math.floor(time.getTime() / (24 * 60 * 60 * 1000));
  const index = dayIndex % wallpapers.length;
  const url = wallpapers[index];

  return (
    <Backdrop
      className="Wallpapers fullscreen"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
};

export default Wallpapers;
