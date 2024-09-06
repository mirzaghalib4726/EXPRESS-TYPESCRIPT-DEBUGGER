import express from "express";
import { maxSubArray, sumArray } from "../controller/others";

const router = express.Router();

router.post("/sum", sumArray);

router.post("/test", maxSubArray);

export default router;
