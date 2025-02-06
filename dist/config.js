"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfiguration = exports.METHODS_ENUM = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
var METHODS_ENUM;
(function (METHODS_ENUM) {
    METHODS_ENUM["CREATE"] = "POST";
    METHODS_ENUM["READ"] = "GET";
    METHODS_ENUM["UPDATE"] = "PUT";
    METHODS_ENUM["DELETE"] = "DELETE";
})(METHODS_ENUM || (exports.METHODS_ENUM = METHODS_ENUM = {}));
exports.serverConfiguration = {
    port: process.env.PORT || 3000,
    dbFilePath: (fileName) => path_1.default.resolve("db", fileName)
};
