"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const utils_1 = require("../../../utils");
const categories_1 = __importDefault(require("./categories"));
const types_1 = require("./types");
function updateSelectedCategories(existingCategories, updatedCategory, checked) {
    const isAnyCategoryChecked = updatedCategory === "any" && checked;
    const isLastItemBeingUnchecked = !checked && existingCategories.size === 1;
    if (isLastItemBeingUnchecked) {
        return existingCategories;
    }
    if (isAnyCategoryChecked) {
        return new Set(["any"]);
    }
    const categories = new Set(existingCategories);
    categories.delete("any");
    checked
        ? categories.add(updatedCategory)
        : categories.delete(updatedCategory);
    return categories;
}
const JokeSettings = ({ data = types_1.defaultData, setData }) => {
    return (react_1.default.createElement("div", { className: "JokeSettings" },
        react_1.default.createElement("h5", null, "Daily Joke"),
        react_1.default.createElement("label", null,
            "Show a new joke",
            react_1.default.createElement("select", { value: data.timeout, onChange: (event) => setData(Object.assign(Object.assign({}, data), { timeout: Number(event.target.value) })) },
                react_1.default.createElement("option", { value: 5 * utils_1.MINUTES }, "Every 5 minutes"),
                react_1.default.createElement("option", { value: 15 * utils_1.MINUTES }, "Every 15 minutes"),
                react_1.default.createElement("option", { value: utils_1.HOURS }, "Every hour"),
                react_1.default.createElement("option", { value: 24 * utils_1.HOURS }, "Every day"),
                react_1.default.createElement("option", { value: 7 * 24 * utils_1.HOURS }, "Every week"))),
        react_1.default.createElement("label", null,
            "Category",
            categories_1.default.map((category) => {
                return (react_1.default.createElement("label", { key: category.key },
                    react_1.default.createElement("input", { type: "checkbox", checked: data.categories.has(category.key), onChange: (event) => {
                            const categories = updateSelectedCategories(data.categories, category.key, event.target.checked);
                            setData(Object.assign(Object.assign({}, data), { categories }));
                        } }),
                    " ",
                    category.name));
            })),
        react_1.default.createElement("p", null,
            "Powered by",
            " ",
            react_1.default.createElement("a", { href: "https://jokeapi.dev/", target: "_blank", rel: "noopener noreferrer" }, "JokeAPI"))));
};
exports.default = JokeSettings;
//# sourceMappingURL=JokeSettings.js.map