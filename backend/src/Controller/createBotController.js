import pool from "../Config/DBConfig.js";
import ApiResponse from "../utility/ApiResponse.js";
const createBot=async(req,res)=>{
    try {
         const {name,businessName,des}=req.body
         const userId=req.user.rows[0].id
          const query = "INSERT INTO bots(user_id,name,business_name,description) VALUES($1,$2,$3,$4) RETURNING *"
        const values=[userId,name,businessName,des]
          const result = await pool.query(query,values) 
        if(result.rowCount===0){
            return res.status(400).json(new ApiResponse(
                400,"error","Enable to create Bot Try Again later",null
            )
            )
        }  
         return res.status(200).json(new ApiResponse(
                200,"error","Bot Created Successfully",result.rows[0]
            )
            )

    } catch (error) {
        if (error.code === "23505") {
    return res.status(409).json(
        new ApiResponse(
            409,
            "error",
            "You already have a bot for this business.",
            null
        )
    );
        }
         return res.status(400).json(new ApiResponse(
                400,"error",error.message,null
            )
            )
    }
}

export default createBot