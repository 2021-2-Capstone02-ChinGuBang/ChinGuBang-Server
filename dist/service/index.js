"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainService = exports.messageService = exports.roomService = exports.authService = void 0;
var authService_1 = require("./authService");
Object.defineProperty(exports, "authService", { enumerable: true, get: function () { return __importDefault(authService_1).default; } });
var roomService_1 = require("./roomService");
Object.defineProperty(exports, "roomService", { enumerable: true, get: function () { return __importDefault(roomService_1).default; } });
var messageService_1 = require("./messageService");
Object.defineProperty(exports, "messageService", { enumerable: true, get: function () { return __importDefault(messageService_1).default; } });
var mainService_1 = require("./mainService");
Object.defineProperty(exports, "mainService", { enumerable: true, get: function () { return __importDefault(mainService_1).default; } });
//# sourceMappingURL=index.js.map