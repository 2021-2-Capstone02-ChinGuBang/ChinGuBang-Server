import express from "express";
import { authController } from "../controller";
import { typeCheckMiddleware } from "../middleware";

const router = express.Router();

router.post(
  "/email",
  typeCheckMiddleware[0],
  authController.POSTemailController
);
router.post("/code", typeCheckMiddleware[0], authController.POSTcodeController);
export default router;
router.post(
  "/signup",
  typeCheckMiddleware,
  authController.POSTsignupController
);
