"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestions = void 0;
function getSuggestions(query, engineUrl) {
    return new Promise((resolve, reject) => {
        if (!window.mountResult) {
            window.mountResult = {};
        }
        const id = "i" + Math.random().toString(36).slice(2); // Create unique id to return to correct result
        window.mountResult[id] = (data) => {
            // Resolve the suggestions
            resolve(data[1]);
            if (window.mountResult) {
                delete window.mountResult.id;
            }
            const scriptToRemove = document.getElementById("suggestionsQuery" + id);
            if (scriptToRemove !== null) {
                scriptToRemove.remove();
            }
        };
        const scriptToAdd = document.createElement("script");
        scriptToAdd.id = "suggestionsQuery" + id;
        scriptToAdd.onerror = reject;
        scriptToAdd.src = engineUrl
            .replace("{searchTerms}", query)
            .replace("{callback}", `mountResult.${id}`);
        document.head.appendChild(scriptToAdd);
    });
}
exports.getSuggestions = getSuggestions;
//# sourceMappingURL=getSuggestions.js.map