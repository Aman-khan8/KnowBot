import pool from "../Config/DBConfig.js"
import ApiResponse from "../utility/ApiResponse.js"

const getDocuments=async(req,res)=>{
    try {
        const {botId}= req.body
        const query = "SELECT id,bot_id,file_name FROM documents WHERE bot_id=$1"
        const response=await pool.query(query,[botId])
           
                
    return res.status(200).json(new ApiResponse(200,"success","All documents fetched Successfully",response.rows))
        


    } catch (error) {
            return res.status(500).json(new ApiResponse(500,"error","Error in fetching document"+error.message,null))
        
    }
}

export default getDocuments