"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const api_1 = require("../api");
const ui_1 = require("../contexts/ui");
const migrate_1 = require("../db/migrate");
const state_1 = require("../db/state");
const lib_1 = require("../lib");
const dashboard_1 = require("./dashboard");
const settings_1 = require("./settings");
const Errors_1 = __importDefault(require("./shared/Errors"));
const StoreError_1 = __importDefault(require("./shared/StoreError"));
const messages = (0, react_intl_1.defineMessages)({
    pageTitle: {
        id: "app.pageTitle",
        description: "Page title that Tabliss displays in the title bar.",
        defaultMessage: "New Tab",
    },
});
const Root = () => {
    // Set page title
    const intl = (0, react_intl_1.useIntl)();
    react_1.default.useEffect(() => {
        document.title = intl.formatMessage(messages.pageTitle);
    }, [intl]);
    // Wait for storage to be ready before displaying
    const [ready, setReady] = react_1.default.useState(false);
    const [error, setError] = react_1.default.useState(false);
    const pushError = (0, api_1.usePushError)();
    const handleError = (message, showError) => (error) => {
        pushError({ message });
        console.error(error);
        console.error("Caused by:", error.cause);
        if (showError)
            setError(true);
    };
    react_1.default.useEffect(() => {
        const subscriptions = Promise.all([
            // Config database
            state_1.dbStorage
                .then((errors) => lib_1.Stream.subscribe(errors, handleError("Cannot save your settings. You may have hit the maximum storage capacity.", true)))
                .catch(handleError("Cannot open settings storage. Your settings cannot be loaded or saved.", true)),
            // Cache database
            state_1.cacheStorage
                .then((errors) => lib_1.Stream.subscribe(errors, handleError("Cannot save cache. Start up performance may be degraded.", false)))
                .catch(handleError("Cannot open cache. Start up performance may be degraded.", false)),
        ]);
        // Storage is ready
        subscriptions.then(() => {
            setReady(true);
            (0, migrate_1.migrate)();
        });
        return () => {
            // Remove error subscriptions
            subscriptions.then(([dbSub, cacheSub]) => {
                if (dbSub)
                    dbSub();
                if (cacheSub)
                    cacheSub();
            });
        };
    }, []);
    const { errors, settings, toggleErrors } = react_1.default.useContext(ui_1.UiContext);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        ready ? react_1.default.createElement(dashboard_1.Dashboard, null) : null,
        ready && settings ? react_1.default.createElement(settings_1.Settings, null) : null,
        errors ? react_1.default.createElement(Errors_1.default, { onClose: toggleErrors }) : null,
        error ? react_1.default.createElement(StoreError_1.default, { onClose: () => setError(false) }) : null));
};
exports.default = Root;
//# sourceMappingURL=App.js.map