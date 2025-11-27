import { Router } from "express";
import { getResult } from "../constolers/ai.contoller.js";

const router = Router()

router.get("get-result",getResult)

export default router