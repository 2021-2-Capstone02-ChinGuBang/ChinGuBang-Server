import express from "express";
import { roomController } from "../controller";
import { typeCheckMiddleware, authMiddleware } from "../middleware";

const upload = require("../modules/upload");
const router = express.Router();

router.post(
  "",
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "restroom", maxCount: 1 },
    { name: "kitchen", maxCount: 1 },
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 1 },
    { name: "photo3", maxCount: 1 },
  ]),
  authMiddleware,
  roomController.POSTroomController
);

export default router;
