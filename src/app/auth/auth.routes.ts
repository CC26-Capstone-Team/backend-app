import { Router, type IRouter } from "express";
import { register, login, logout, registerGoogle, loginGoogle } from "./auth.controller.js";

const router: IRouter = Router();

router.post("/register", register);
router.post("/register/google", registerGoogle);
router.post("/login", login);
router.post("/login/google", loginGoogle);
router.post("/logout", logout);

export default router;
