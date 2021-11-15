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

export default router;
