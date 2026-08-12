import createBot from "../Controller/createBotController.js";
import express from "express";

const router = express.Router()


router.post("/createbot",createBot);



export default router;