"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../hooks");
const Backdrop_1 = __importDefault(require("../../../views/shared/Backdrop"));
require("./Wallpapers.sass");
// All wallpapers sourced from Unsplash (https://unsplash.com)
// Unsplash License: free for commercial and non-commercial use
// Architecture & Buildings
const unsplash_architecture_modern_building_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-architecture-modern-building-2560x1440.jpg"));
const unsplash_architecture_glass_skyscraper_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-architecture-glass-skyscraper-2560x1440.jpg"));
const unsplash_architecture_white_concrete_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-architecture-white-concrete-2560x1440.jpg"));
const unsplash_architecture_cathedral_interior_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-architecture-cathedral-interior-2560x1440.jpg"));
// Bridges
const unsplash_bridge_golden_gate_fog_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-bridge-golden-gate-fog-2560x1440.jpg"));
const unsplash_bridge_suspension_night_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-bridge-suspension-night-2560x1440.jpg"));
const unsplash_bridge_old_stone_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-bridge-old-stone-2560x1440.jpg"));
// City Skylines
const unsplash_city_skyline_sunset_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-city-skyline-sunset-2560x1440.jpg"));
const unsplash_city_skyline_night_lights_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-city-skyline-night-lights-2560x1440.jpg"));
const unsplash_city_aerial_daytime_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-city-aerial-daytime-2560x1440.jpg"));
const unsplash_city_downtown_evening_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-city-downtown-evening-2560x1440.jpg"));
const unsplash_city_waterfront_reflection_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-city-waterfront-reflection-2560x1440.jpg"));
// Landmarks
const unsplash_landmark_eiffel_tower_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-landmark-eiffel-tower-2560x1440.jpg"));
const unsplash_landmark_colosseum_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-landmark-colosseum-2560x1440.jpg"));
const unsplash_landmark_taj_mahal_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-landmark-taj-mahal-2560x1440.jpg"));
const unsplash_landmark_big_ben_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-landmark-big-ben-2560x1440.jpg"));
// Nature & Scenic
const unsplash_nature_mountain_lake_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-nature-mountain-lake-2560x1440.jpg"));
const unsplash_nature_forest_mist_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-nature-forest-mist-2560x1440.jpg"));
const unsplash_nature_ocean_coast_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-nature-ocean-coast-2560x1440.jpg"));
const unsplash_nature_northern_lights_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-nature-northern-lights-2560x1440.jpg"));
const unsplash_nature_snowy_mountains_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-nature-snowy-mountains-2560x1440.jpg"));
// Scenic / Travel
const unsplash_scenic_santorini_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-scenic-santorini-2560x1440.jpg"));
const unsplash_scenic_venice_canal_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-scenic-venice-canal-2560x1440.jpg"));
const unsplash_scenic_japanese_temple_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-scenic-japanese-temple-2560x1440.jpg"));
const unsplash_scenic_swiss_village_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-scenic-swiss-village-2560x1440.jpg"));
// Night / Moody
const unsplash_night_starry_sky_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-night-starry-sky-2560x1440.jpg"));
const unsplash_night_city_rain_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-night-city-rain-2560x1440.jpg"));
// Winter / Snow
const unsplash_winter_cabin_snow_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-winter-cabin-snow-2560x1440.jpg"));
const unsplash_winter_frozen_lake_2560x1440_jpg_1 = __importDefault(require("../../../assets/wallpapers/unsplash-winter-frozen-lake-2560x1440.jpg"));
const wallpapers = [
    unsplash_architecture_modern_building_2560x1440_jpg_1.default,
    unsplash_architecture_glass_skyscraper_2560x1440_jpg_1.default,
    unsplash_architecture_white_concrete_2560x1440_jpg_1.default,
    unsplash_architecture_cathedral_interior_2560x1440_jpg_1.default,
    unsplash_bridge_golden_gate_fog_2560x1440_jpg_1.default,
    unsplash_bridge_suspension_night_2560x1440_jpg_1.default,
    unsplash_bridge_old_stone_2560x1440_jpg_1.default,
    unsplash_city_skyline_sunset_2560x1440_jpg_1.default,
    unsplash_city_skyline_night_lights_2560x1440_jpg_1.default,
    unsplash_city_aerial_daytime_2560x1440_jpg_1.default,
    unsplash_city_downtown_evening_2560x1440_jpg_1.default,
    unsplash_city_waterfront_reflection_2560x1440_jpg_1.default,
    unsplash_landmark_eiffel_tower_2560x1440_jpg_1.default,
    unsplash_landmark_colosseum_2560x1440_jpg_1.default,
    unsplash_landmark_taj_mahal_2560x1440_jpg_1.default,
    unsplash_landmark_big_ben_2560x1440_jpg_1.default,
    unsplash_nature_mountain_lake_2560x1440_jpg_1.default,
    unsplash_nature_forest_mist_2560x1440_jpg_1.default,
    unsplash_nature_ocean_coast_2560x1440_jpg_1.default,
    unsplash_nature_northern_lights_2560x1440_jpg_1.default,
    unsplash_nature_snowy_mountains_2560x1440_jpg_1.default,
    unsplash_scenic_santorini_2560x1440_jpg_1.default,
    unsplash_scenic_venice_canal_2560x1440_jpg_1.default,
    unsplash_scenic_japanese_temple_2560x1440_jpg_1.default,
    unsplash_scenic_swiss_village_2560x1440_jpg_1.default,
    unsplash_night_starry_sky_2560x1440_jpg_1.default,
    unsplash_night_city_rain_2560x1440_jpg_1.default,
    unsplash_winter_cabin_snow_2560x1440_jpg_1.default,
    unsplash_winter_frozen_lake_2560x1440_jpg_1.default,
];
const Wallpapers = () => {
    const time = (0, hooks_1.useTime)("absolute");
    const validWallpapers = wallpapers.filter(Boolean);
    if (validWallpapers.length === 0) {
        return (react_1.default.createElement(Backdrop_1.default, { className: "Wallpapers fullscreen", style: { background: "linear-gradient(135deg, #1a1a2e, #16213e)" } }));
    }
    const dayIndex = Math.floor(time.getTime() / (24 * 60 * 60 * 1000));
    const index = dayIndex % validWallpapers.length;
    const url = validWallpapers[index];
    return (react_1.default.createElement(Backdrop_1.default, { className: "Wallpapers fullscreen", style: { backgroundImage: `url(${url})` } }));
};
exports.default = Wallpapers;
//# sourceMappingURL=Wallpapers.js.map