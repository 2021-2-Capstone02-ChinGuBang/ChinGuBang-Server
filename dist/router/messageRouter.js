"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const upload = require("../modules/upload");
const router = express_1.default.Router();
router.post("/:roomID", middleware_1.authMiddleware, controller_1.messageController.POSTmessageController);
router.get("/:messageRoomID", middleware_1.authMiddleware, controller_1.messageController.GETmessageRoomController);
router.get("", middleware_1.authMiddleware, controller_1.messageController.GETmessageController);
exports.default = router;
//# sourceMappingURL=messageRouter.js.map