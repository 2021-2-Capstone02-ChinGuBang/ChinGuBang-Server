import { Route53RecoveryCluster } from "aws-sdk";
import express, { Request, Response } from "express";

import authRouter from "./authRouter";
import roomRouter from "./roomRouter";
import messageRouter from "./messageRouter";

import { response, returnCode } from "../library";

const router = express.Router();

router.get("", async (req: Request, res: Response) => {
  try {
    response.basicResponse(res, returnCode.OK, "chingubang api");
  } catch (err) {
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

router.use("/api/v1/auth", authRouter);
router.use("/api/v1/room", roomRouter);
router.use("/api/v1/message", messageRouter);
export default router;
