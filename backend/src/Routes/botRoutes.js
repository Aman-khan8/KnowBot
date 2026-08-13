import createBot from "../Controller/createBotController.js";
import AnswerQuestion from "../Controller/questionEmbedController.js"
import express from "express";
import protect from "../Middlewares/validateRequest.js"
const router = express.Router()


router.post("/createbot",createBot);




router.post("/question",AnswerQuestion)


export default router;