import { Router } from "express";
import { signup, login } from "../Controller";
import { checkExistingUser } from "../Middleware";

const router = Router();

router.post("/signup", checkExistingUser, signup);
router.post("/login", login);

export default router;
