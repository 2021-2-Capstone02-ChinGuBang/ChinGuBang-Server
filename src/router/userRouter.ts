import express from "express";
import { userController } from "../controller";
import { typeCheckMiddleware, authMiddleware } from "../middleware";

const upload = require("../modules/upload");
const router = express.Router();

router.get("/room", authMiddleware, userController.GETmyRoomController);

export default router;
