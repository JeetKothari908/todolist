"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = exports.subscribe = exports.init = void 0;
const init = () => ({ subscribers: new Set() });
exports.init = init;
const subscribe = (stream, subscriber) => {
    stream.subscribers.add(subscriber);
    return () => {
        stream.subscribers.delete(subscriber);
    };
};
exports.subscribe = subscribe;
const publish = (stream, next) => {
    stream.subscribers.forEach((subscriber) => subscriber(next));
};
exports.publish = publish;
//# sourceMappingURL=stream.js.map