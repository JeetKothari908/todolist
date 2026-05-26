"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeLocation = exports.requestLocation = exports.getForecast = void 0;
/** Get current forecast for a location */
async function getForecast({ latitude, longitude, units }, loader) {
    if (!latitude || !longitude) {
        return;
    }
    loader.push();
    const url = "https://api.open-meteo.com/v1/forecast?" +
        `latitude=${latitude}&` +
        `longitude=${longitude}&` +
        "hourly=temperature_2m&" +
        "hourly=apparent_temperature&" +
        "hourly=relativehumidity_2m&" +
        "hourly=weathercode&" +
        "timeformat=unixtime&" +
        `temperature_unit=${units === "us" ? "fahrenheit" : "celsius"}`;
    const res = await fetch(url);
    const body = await res.json();
    loader.pop();
    // Process results
    // TODO: validate response
    return {
        timestamp: Date.now(),
        conditions: body.hourly.time.map((time, i) => ({
            timestamp: time * 1000, // convert to ms
            temperature: body.hourly.temperature_2m[i],
            apparentTemperature: body.hourly.apparent_temperature[i],
            humidity: body.hourly.relativehumidity_2m[i],
            weatherCode: body.hourly.weathercode[i],
        })),
    };
}
exports.getForecast = getForecast;
/** Request current location from the browser */
function requestLocation() {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(({ coords }) => resolve({
        latitude: round(coords.latitude),
        longitude: round(coords.longitude),
    }), reject));
}
exports.requestLocation = requestLocation;
/** Perform geocoding lookup on query string */
async function geocodeLocation(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1`;
    const res = await fetch(url);
    const data = await res.json();
    return {
        latitude: round(data.results[0].latitude),
        longitude: round(data.results[0].longitude),
    };
}
exports.geocodeLocation = geocodeLocation;
function round(x, precision = 4) {
    return Math.round(x * 10 ** precision) / 10 ** precision;
}
//# sourceMappingURL=api.js.map