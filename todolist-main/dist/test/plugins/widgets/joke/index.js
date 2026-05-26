"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joke_1 = __importDefault(require("./Joke"));
const JokeSettings_1 = __importDefault(require("./JokeSettings"));
const config = {
    key: "widget/joke",
    name: "Jokes",
    description: "Some amusement or laughter",
    dashboardComponent: Joke_1.default,
    settingsComponent: JokeSettings_1.default,
};
exports.default = config;
//# sourceMappingURL=index.js.map