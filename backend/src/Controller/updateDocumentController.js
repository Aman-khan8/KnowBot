import pool from "../Config/DBConfig.js";
import ApiResponse from "../utility/ApiResponse.js";
import validateBot from "../utility/validateBot.js"


const updateDocument = async(req,res)=>{
try {

    const {botId,documentId,fileName}=req.body
    
    const userId = req.user.rows[0].id
    
  const isValidBot = await validateBot(botId, userId);

if (!isValidBot) {
        return res.status(403).json(new ApiResponse(403,"error","You have no access over this file",null))
     }

    const query = "UPDATE documents SET file_name = $1 WHERE id = $2 AND bot_id = $3"

    const response = await pool.query(query,[fileName,documentId,botId])

      if(response.rowCount===0){
            return res.status(404).json(new ApiResponse(404,"error","No document Found",null))
        }

        return res.status(200).json(new ApiResponse(200,"success","document edited  Successfully",response.rows)) 


} catch (error) {
    return res.status(500).json(new ApiResponse(500,"error","Error in Edition of document "+error.message,null))
}
}


export default updateDocument