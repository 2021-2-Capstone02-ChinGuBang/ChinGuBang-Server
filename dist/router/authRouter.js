"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.post("/email", middleware_1.typeCheckMiddleware[0], controller_1.authController.POSTemailController);
router.post("/code", middleware_1.typeCheckMiddleware[0], controller_1.authController.POSTcodeController);
router.post("/signup", middleware_1.typeCheckMiddleware, controller_1.authController.POSTsignupController);
router.post("/signin", middleware_1.typeCheckMiddleware, controller_1.authController.POSTsigninController);
exports.default = router;
//# sourceMappingURL=authRouter.js.map