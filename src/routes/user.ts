import express, { NextFunction, Request, Response } from "express";
import { mongoTimezone } from "../controller/user";

const router = express.Router();

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("req.url: ", req.originalUrl);
  next();
};

router.get("/task", loggerMiddleware, mongoTimezone);
// router.get("/task", mongoTimezone);

export default router;
