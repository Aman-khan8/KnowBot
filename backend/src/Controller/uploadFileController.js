import s3 from "../Config/AWSConfig.js";
import ApiResponse from "../utility/ApiResponse.js"
import {uploadToS3} from "../Services/putCommand.js"

const uploadFile=async(req,res)=>{

    try{
        const file=req.file;
        if(!file){
            return res.status(400).json(new ApiResposnse(
                400,"error","No file uploaded",null
            ))

        }
        const result = await(uploadToS3(file))
        if(!result){
            return res.status(400).json(new ApiResponse(
                400,"error","Failed to upload successfully",null
            ))
        }

        return res.status(200).json(new ApiResponse(
                200,"success","File uploaded successfully",result
            ))
    }
    catch(err){
        return res.status(400).json(new ApiResponse(
                400,"error",err.message,null
            ))
    }
} 



export default uploadFile;