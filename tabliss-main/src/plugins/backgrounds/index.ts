import colour from "./colour";
import gradient from "./gradient";
import image from "./image";
import wallpapers from "./wallpapers";

export const backgroundConfigs = [colour, gradient, image, wallpapers];

backgroundConfigs.sort((a, b) => a.name.localeCompare(b.name));
