import { Router } from "express";

import authRouter from "./authRouter";
import airwayCompanyRouter from "./airwayCompanyRouter";
import nationalityRouter from "./nationalityRouter";
import userRouter from "./userRouter";
import airPortRouter from "./airPortRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/airway", airwayCompanyRouter);
router.use("/nationality", nationalityRouter);
router.use("/user", userRouter);
router.use("/airport", airPortRouter);

export default router;