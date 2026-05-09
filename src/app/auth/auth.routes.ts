import { Router, type IRouter } from "express";
import { register, login, logout, registerGoogle, loginGoogle } from "./auth.controller.js";
import validateBody from "../../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router: IRouter = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/register/google", registerGoogle);
router.post("/login", validateBody(loginSchema), login);
router.post("/login/google", loginGoogle);
router.post("/logout", logout);

export default router;
