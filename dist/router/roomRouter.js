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
router.post("", upload.fields([
    { name: "main", maxCount: 1 },
    { name: "restroom", maxCount: 1 },
    { name: "kitchen", maxCount: 1 },
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
]), middleware_1.authMiddleware, controller_1.roomController.POSTroomController);
router.patch("/:roomID", upload.fields([
    { name: "main", maxCount: 1 },
    { name: "restroom", maxCount: 1 },
    { name: "kitchen", maxCount: 1 },
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
]), middleware_1.authMiddleware, controller_1.roomController.PATCHroomController);
// router.post("", authMiddleware, roomController.POSTroomController);
router.get("", middleware_1.authMiddleware, controller_1.roomController.GETallRoomController);
router.get("/:roomID", middleware_1.authMiddleware, controller_1.roomController.GETroomDetailController);
router.post("/like/:roomID", middleware_1.authMiddleware, controller_1.roomController.POSTlikeController);
router.post("/filter", middleware_1.authMiddleware, controller_1.roomController.POSTroomFilterController);
router.delete("/:roomID", middleware_1.authMiddleware, controller_1.roomController.DELETEroomController);
exports.default = router;
//# sourceMappingURL=roomRouter.js.map