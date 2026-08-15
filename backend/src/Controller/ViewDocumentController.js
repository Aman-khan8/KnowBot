import pool from "../Config/DBConfig.js";
import ApiResponse from "../utility/ApiResponse.js";
import validateBot from "../utility/validateBot.js";
import getDocumentUrl from "../Services/getDocumentUrl.js";


const viewDocument =async(req,res)=>{
    try {
        const {botId,document_id}=req.body

     const userId=req.user.rows[0].id
    
    const isValidBot = await validateBot(botId, userId);

if (!isValidBot) {
        return res.status(403).json(new ApiResponse(403,"error","You have no access over this file",null))
     }

    const response = await pool.query("SELECT s3_key FROM documents WHERE id = $1",[document_id])
     const url= await getDocumentUrl(response.rows[0].s3_key)
            
     return res.status(200).json(new ApiResponse(200,"sucess","File fetched successfully",url))

    } catch (error) {
                return res.status(500).json(new ApiResponse(500,"error","Error in ViewController "+error.message,null))
    }
}

export default viewDocument