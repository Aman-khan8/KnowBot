import pool from "../Config/DBConfig.js";
import ApiResponse from "../utility/ApiResponse.js";
import validateBot from "../utility/validateBot.js"


const updateBot = async(req,res)=>{
try {

    const {botId,botName,businessName,description}=req.body
    
    const userId = req.user.rows[0].id

    const query = "UPDATE bots SET name = $1 AND business_name = $2 AND description =$3 WHERE id = $4 AND user_id = $5"

    const response = await pool.query(query,[botName,botId,businessName,description,userId])

      if(response.rowCount===0){
            return res.status(404).json(new ApiResponse(404,"error","No Bot Found",null))
        }

        return res.status(200).json(new ApiResponse(200,"success","Bot edited  Successfully",response.rows)) 


} catch (error) {
    return res.status(500).json(new ApiResponse(500,"error","Error in Edition of Bot "+error.message,null))
}
}


export default updateBot