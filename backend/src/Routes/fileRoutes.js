import express from "express"
import upload from "../Middlewares/multerUpload.js"
import uploadFile from "../Controller/uploadFileController.js"
import deleteFile from "../Controller/deleteFileController.js"

const router = express.Router()

router.post("/upload",upload.single("document"),uploadFile)
router.delete("/delete/:id",deleteFile)
export default router