"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGif = void 0;
async function getGif({ tag, nsfw }, loader) {
    const tags = tag.split(",").map((t) => t.trim());
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    const request = new Request("https://api.giphy.com/v1/gifs/random" +
        `?api_key=${GIPHY_API_KEY}` +
        "&rating=" +
        (nsfw ? "r" : "g") +
        (randomTag ? `&tag=${encodeURIComponent(randomTag)}` : ""));
    loader.push();
    const res = await (await fetch(request)).json();
    const data = await (await fetch(res.data.images.original.webp)).blob();
    loader.pop();
    return {
        data,
        link: res.data.url,
    };
}
exports.getGif = getGif;
//# sourceMappingURL=api.js.map