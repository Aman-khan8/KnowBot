import signup from "../Controller/SignupController.js"
import login from "../Controller/loginController.js"
import express from "express"


const router =express.Router()

router.post("/signup",signup)
router.post("/login",login)

export default router