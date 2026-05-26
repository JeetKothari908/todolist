"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderLink = exports.removeLink = exports.updateLink = exports.addLink = void 0;
function addLink() {
    return {
        type: "ADD_LINK",
    };
}
exports.addLink = addLink;
function updateLink(index, link) {
    return {
        type: "UPDATE_LINK",
        data: { index, link },
    };
}
exports.updateLink = updateLink;
function removeLink(index) {
    return {
        type: "REMOVE_LINK",
        data: { index },
    };
}
exports.removeLink = removeLink;
function reorderLink(index, to) {
    return {
        type: "REORDER_LINK",
        data: { index, to },
    };
}
exports.reorderLink = reorderLink;
//# sourceMappingURL=actions.js.map