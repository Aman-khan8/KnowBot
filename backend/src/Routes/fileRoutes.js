import express from "express"
import upload from "../Middlewares/multerUpload.js"
import uploadFile from "../Controller/uploadFileController.js"
import deleteFile from "../Controller/deleteFileController.js"
import getDocuments from "../Controller/getDocumentsController.js"
import viewDocument from "../Controller/ViewDocumentController.js"

const router = express.Router()

router.post("/upload/:id",upload.single("document"),uploadFile)
router.delete("/delete/:id",deleteFile)
router.get("/getdocuments",getDocuments)
router.post("/geturl",viewDocument)
export default router