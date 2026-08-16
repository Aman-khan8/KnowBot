import pool from "../Config/DBConfig.js";
import ApiResponse from "../utility/ApiResponse.js";


const deleteBot=async(req,res)=>{
    try {
        
        const {botId}=req.body;
        const userId=req.user.rows[0].id
        const response = await pool.query("DELETE FROM bots WHERE id = $1 AND user_id =$2",[botId,userId])

        if(response.rowCount===0){
            return res.status(404).json(new ApiResponse(404,"error","No bot Found",null))
        }

        return res.status(200).json(new ApiResponse(200,"success","Bot deleted Successfully",response.rows))



    } catch (error) {
        return res.status(500).json(new ApiResponse(500,"error","Error in delete Bot"+error.message,null))
    }
}

export default deleteBot