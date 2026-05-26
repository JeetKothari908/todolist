"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatMessages = void 0;
const react_1 = require("react");
const react_intl_1 = require("react-intl");
function useFormatMessages(messsages) {
    const intl = (0, react_intl_1.useIntl)();
    return (0, react_1.useMemo)(() => Object.fromEntries(Object.entries(messsages).map(([id, message]) => [
        id,
        intl.formatMessage(message),
    ])), [intl, messsages]);
}
exports.useFormatMessages = useFormatMessages;
//# sourceMappingURL=useFormatMessages.js.map