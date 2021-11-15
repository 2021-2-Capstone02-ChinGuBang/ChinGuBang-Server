import express from "express";
import { messageController } from "../controller";
import { typeCheckMiddleware, authMiddleware } from "../middleware";

const upload = require("../modules/upload");
const router = express.Router();

router.post(
  "/:roomID",
  authMiddleware,
  messageController.POSTmessageController
);

router.get(
  "/:messageRoomID",
  authMiddleware,
  messageController.GETmessageRoomController
);

export default router;
