import { Router, type IRouter } from "express";
import { register, login, logout } from "./auth.controller.js";

const router: IRouter = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
