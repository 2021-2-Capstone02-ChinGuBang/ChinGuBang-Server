import { Route53RecoveryCluster } from "aws-sdk";
import express, { Request, Response } from "express";

// import userRouter from "./user";

import { response, returnCode } from "../library";

const router = express.Router();

router.get("", async (req: Request, res: Response) => {
  try {
    response.basicResponse(res, returnCode.OK, "o2 api");
  } catch (err) {
    response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

// router.use("/user", userRouter);

export default router;
