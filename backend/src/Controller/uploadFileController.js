import s3 from "../Config/AWSConfig.js";
import ApiResponse from "../utility/ApiResponse.js"
import {uploadToS3} from "../Services/putCommand.js"
import pool from "../Config/DBConfig.js"

const uploadFile=async(req,res)=>{

    try{
        const file=req.file;
        if(!file){
            return res.status(400).json(new ApiResposnse(
                400,"error","No file uploaded",null
            ))

        }
        const result = await(uploadToS3(file,req.user.rows[0].id))
        if(!result){
            return res.status(400).json(new ApiResponse(
                400,"error","Failed to upload successfully",null
            ))
        }

       const query="INSERT INTO documents (user_id,file_name,s3_key) VALUES($1,$2,$3) RETURNING *"
      const values=[req.user.rows[0].id,result.fileName,result.key]
      const dbResult=await pool.query(query,values)
      if(dbResult.rowCount===0){
        return res.status(402).json(new ApiResponse(
                402,"error","Failed to save file information",null
            ))
      }
       return res.status(200).json(new ApiResponse(
                200,"success","File uploaded successfully",dbResult.rows[0]
            ))
    }
    catch(err){
        return res.status(400).json(new ApiResponse(
                400,"error",err.message,null
            ))
    }
} 



export default uploadFile;