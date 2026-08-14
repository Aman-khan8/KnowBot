import pool from "../Config/DBConfig.js";
import ApiResponse from "../utility/ApiResponse.js";


const getAllBots=async(req,res)=>{
    try {
         const userId=req.user.rows[0].id

         const query = "SELECT * from bots b WHERE user_id = $1"
         const response = await pool.query(query,[userId])
         
         
        return res.status(200).json(new ApiResponse(200,"success","All bots fetched Successfully",response.rows))




    } catch (error) {
        return res.status(500).json(new ApiResponse(500,"error","Error in fetching bots"+error.message,null))
    }
}


export default getAllBots