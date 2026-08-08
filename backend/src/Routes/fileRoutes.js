import express from "express"
import upload from "../Middlewares/multerUpload.js"
import uploadFile from "../Controller/uploadFileController.js"

const router = express.Router()

router.post("/upload",upload.single("document"),uploadFile)

export default router