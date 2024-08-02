import express, { NextFunction, Request, Response } from "express";
import { createUser, getUserTimezone, mongoTimezone } from "../controller/user";

const router = express.Router();

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("req.url: ", req.originalUrl);
  next();
};

router.post("/create", createUser);
router.get("/getTimeZone", getUserTimezone);
router.get("/task", loggerMiddleware, mongoTimezone);

export default router;
