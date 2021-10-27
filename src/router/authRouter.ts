import express from "express";
import { authController } from "../controller";
import { typeCheckMiddleware } from "../middleware";

const router = express.Router();

router.post(
    "/email",
    typeCheckMiddleware[0],
    authController.POST_auth_email_Controller,
);

export default router;
