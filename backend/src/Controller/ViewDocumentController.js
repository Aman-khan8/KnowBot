import pool from "../Config/DBConfig.js";
import ApiResponse from "../utility/ApiResponse.js";
import validateBot from "../utility/validateBot.js";
import getDocumentUrl from "../Services/getDocumentUrl.js";


const viewDocument =async(req,res)=>{
    try {
        const {botId,s3_Key}=req.body

     const userId=req.user.rows[0].id
        console.log("key",s3_Key)
    const isValidBot = await validateBot(botId, userId);

if (!isValidBot) {
        return res.status(403).json(new ApiResponse(403,"error","You have no access over this file",null))
     }

     const url= await getDocumentUrl(s3_key)
            
     return res.status(200).json(new ApiResponse(200,"sucess","File fetched successfully",url))

    } catch (error) {
                return res.status(500).json(new ApiResponse(500,"error","Error in ViewController "+error.message,null))
    }
}

export default viewDocument