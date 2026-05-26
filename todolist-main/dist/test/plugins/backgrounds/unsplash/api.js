"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWidth = exports.buildLink = exports.fetchImages = exports.officialCollection = void 0;
exports.officialCollection = 1053828;
const fetchImages = async ({ by, collections, topics, featured, search, }) => {
    const url = "https://api.unsplash.com/photos/random";
    const params = new URLSearchParams();
    const headers = new Headers({
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
    });
    params.set("count", "10");
    switch (by) {
        case "collections":
            params.set("collections", collections);
            break;
        case "topics":
            params.set("topics", topics);
            params.set("orientation", "landscape");
            break;
        case "search":
            params.set("orientation", "landscape");
            if (featured)
                params.set("featured", "true");
            if (search)
                params.set("query", search);
            break;
        default:
            params.set("collections", String(exports.officialCollection));
    }
    const res = await fetch(`${url}?${params}`, { headers, cache: "no-cache" });
    const body = await res.json();
    // TODO: validate types
    return body.map((item) => ({
        src: item.urls.raw,
        credit: {
            imageLink: item.links.html,
            location: item.location ? item.location.name : null,
            userName: item.user.name,
            userLink: item.user.links.html,
        },
    }));
};
exports.fetchImages = fetchImages;
/**
 * Build image link from raw
 * TODO: allow quality to be adjustable, possibly in combination with size
 */
const buildLink = (src) => {
    const url = new URL(src);
    url.searchParams.set("q", "85");
    url.searchParams.set("w", String(calculateWidth(window.innerWidth, window.devicePixelRatio)));
    return String(url);
};
exports.buildLink = buildLink;
/**
 * Calculate width to fetch image, tuned for Unsplash cache performance.
 */
function calculateWidth(screenWidth = 1920, pixelRatio = 1) {
    // Consider a minimum resolution too
    screenWidth = screenWidth * pixelRatio; // Find true resolution
    screenWidth = Math.max(screenWidth, 1920); // Lower limit at 1920
    screenWidth = Math.min(screenWidth, 3840); // Upper limit at 4K
    screenWidth = Math.ceil(screenWidth / 240) * 240; // Snap up to nearest 240px for improved caching
    return screenWidth;
}
exports.calculateWidth = calculateWidth;
//# sourceMappingURL=api.js.map