import express from "express";
import { mainController } from "../controller";
import { typeCheckMiddleware, authMiddleware } from "../middleware";

const upload = require("../modules/upload");
const router = express.Router();

router.get("", authMiddleware, mainController.GETmainController);

export default router;
