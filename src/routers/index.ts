import { Router } from "express";

import authRouter from "./authRouter";
import airwayCompanyRouter from "./airwayCompanyRouter";
import nationalityRouter from "./nationalityRouter";
import userRouter from "./userRouter";
import airPortRouter from "./airPortRouter";
import flightRouter from "./flightRouter";
import ticketRouter from "./ticketRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/airway", airwayCompanyRouter);
router.use("/nationality", nationalityRouter);
router.use("/user", userRouter);
router.use("/airport", airPortRouter);
router.use("/flight", flightRouter);
router.use("/ticket", ticketRouter);

export default router;