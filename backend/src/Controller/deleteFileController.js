import s3 from "../Config/AWSConfig.js";
import deleteFromS3 from "../Services/deleteCommand.js"
import pool from "../Config/DBConfig.js"
import ApiResponse from "../utility/ApiResponse.js";

const deleteFile=async(req,res)=>{
    try{
        const fileId=req.params.id;
        const query ="SELECT * FROM documents WHERE id=$1"
        const value=[fileId]
        const deleteDocument= await pool.query(query,value)
        
        if(deleteDocument.rowCount===0){
            return res.status(404).json(
                new ApiResponse(404,"error","File not Found",null)
            )
        }

        const AwsResult=await deleteFromS3(deleteDocument.rows[0],req.user.rows[0].id)
         
        if(!AwsResult){
            return res.status(400).json(
                new ApiResponse(400,"error","Failed to delete file from S3 Try Again ",null)
            )
        }

        const deleteQuery="DELETE FROM documents WHERE id=$1"
        const deleteValue=[fileId]
        const dbResult=await pool.query(deleteQuery,deleteValue)

        if(!dbResult){
             return res.status(400).json(
                new ApiResponse(400,"error","Failed to delete from DB",null)
            )
        }

        return res.status(200).json(
            
              new ApiResponse(200,"success","File Deleted Successfully",dbResult.rows[0])
        )
    }
    catch(err){
        return res.status(400).json(
                new ApiResponse(400,"error",err.message,null)
            )
    }
    
}

export default deleteFile;