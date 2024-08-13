import express from "express";
import { sumArray } from "../controller/others";

const router = express.Router();

router.post("/sum", sumArray);

export default router;
