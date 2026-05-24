import { Router, type IRouter } from "express";
import { register, login, logout, loginGoogle } from "./auth.controller.js";
import validateBody from "../../middleware/validate.middleware.js";
import { googleAuthSchema, loginSchema, registerSchema } from "./auth.schema.js";

const router: IRouter = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/google", validateBody(googleAuthSchema),loginGoogle);
router.post("/logout", logout);

export default router;
