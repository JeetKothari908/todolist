import React from "react";
import { useTime } from "../../../hooks";
import Backdrop from "../../../views/shared/Backdrop";
import "./Wallpapers.sass";

import wallpaper1 from "../../../assets/wallpapers/105306-brown_and_white_concrete_building-2560x1440.jpg";
import wallpaper2 from "../../../assets/wallpapers/127252-white_concrete_bridge_over_blue_sea_during_daytime-2560x1440.jpg";
import wallpaper3 from "../../../assets/wallpapers/148905-brown_and_white_concrete_houses_during_daytime-2560x1440.jpg";
import wallpaper4 from "../../../assets/wallpapers/149363-lighted_bridge_during_night_time-2560x1440.jpg";
import wallpaper5 from "../../../assets/wallpapers/150994-white_and_black_temple_under_blue_sky_during_daytime-2560x1440.jpg";
import wallpaper6 from "../../../assets/wallpapers/155563-stockholm-car_rental-city-water-building-2560x1440.jpg";
import wallpaper7 from "../../../assets/wallpapers/162355-szchenyi_chain_bridge-body_of_water-bridge-water-water_resources-2560x1440.jpg";
import wallpaper8 from "../../../assets/wallpapers/165485-taj_mahal-agra_fort-yamuna_river-new7wonders_of_the_world-monument-2560x1440.jpg";
import wallpaper9 from "../../../assets/wallpapers/172074-eiffel_tower-les_invalides-arc_de_triomphe-montparnasse-tower-2560x1440.jpg";
import wallpaper10 from "../../../assets/wallpapers/172325-golden_gate_bridge-muir_woods_national_monument-recreation-travel-landmark-2560x1440.jpg";
import wallpaper11 from "../../../assets/wallpapers/175872-chinese_architecture-leipzig-architecture-cloud-daytime-2560x1440.jpg";
import wallpaper12 from "../../../assets/wallpapers/179483-building-carterton-property-property_investment-house-2560x1440.jpg";
import wallpaper13 from "../../../assets/wallpapers/85821-city_skyline_during_night_time-2560x1440.jpg";
import wallpaper14 from "../../../assets/wallpapers/90846-aerial_view_of_city_buildings_during_night_time-2560x1440.jpg";
import wallpaper15 from "../../../assets/wallpapers/90887-aerial_view_of_city_buildings_during_daytime-2560x1440.jpg";
import wallpaper16 from "../../../assets/wallpapers/91694-white_and_gray_concrete_castle_on_top_of_green_mountain_during_daytime-2560x1440.jpg";
import wallpaper17 from "../../../assets/wallpapers/92499-bridge_over_river_during_night_time-2560x1440.jpg";
import wallpaper18 from "../../../assets/wallpapers/92602-brown_concrete_building_near_river_under_blue_sky_during_daytime-2560x1440.jpg";
import wallpaper19 from "../../../assets/wallpapers/92709-people_walking_on_snow_covered_ground_near_white_and_black_concrete_building_during_daytime-2560x1440.jpg";
import wallpaper20 from "../../../assets/wallpapers/93819-london_bridge-sky-arch_bridge-tower_of_london-cable_stayed_bridge-2560x1440.jpg";

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
