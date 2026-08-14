import createBot from "../Controller/createBotController.js";
import AnswerQuestion from "../Controller/questionEmbedController.js"
import express from "express";
import protect from "../Middlewares/validateRequest.js"
import getAllBots from "../Controller/getAllBotsController.js";
const router = express.Router()


router.post("/createbot",protect,createBot);
router.get("/getallbots",protect,getAllBots)



router.post("/question",AnswerQuestion)


export default router;