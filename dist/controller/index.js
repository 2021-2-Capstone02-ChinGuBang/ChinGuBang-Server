"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.mainController = exports.messageController = exports.roomController = exports.authController = void 0;
var authController_1 = require("./authController");
Object.defineProperty(exports, "authController", { enumerable: true, get: function () { return __importDefault(authController_1).default; } });
var roomController_1 = require("./roomController");
Object.defineProperty(exports, "roomController", { enumerable: true, get: function () { return __importDefault(roomController_1).default; } });
var messageController_1 = require("./messageController");
Object.defineProperty(exports, "messageController", { enumerable: true, get: function () { return __importDefault(messageController_1).default; } });
var mainController_1 = require("./mainController");
Object.defineProperty(exports, "mainController", { enumerable: true, get: function () { return __importDefault(mainController_1).default; } });
var userController_1 = require("./userController");
Object.defineProperty(exports, "userController", { enumerable: true, get: function () { return __importDefault(userController_1).default; } });
//# sourceMappingURL=index.js.map