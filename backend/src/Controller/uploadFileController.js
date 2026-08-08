import s3 from "../Config/AWSConfig";
import {uploadtoS3} from "../Services/putCommand.js"

const uploadFile=async(req,res)=>{

    try{
        const file=req.file;
        if(!file){
            return res.status(400).json(new ApiResposnse(
                400,"error","No file uploaded",null
            ))

        }
        const result = await(uploadtoS3(file))
        if(!result){
            return res.status(400).json(new ApiResposnse(
                400,"error","Failed to upload successfully",null
            ))
        }

        return res.status(200).json(new ApiResposnse(
                200,"success","File uploaded successfully",result
            ))
    }
    catch(err){
        return res.status(400).json(new ApiResposnse(
                400,"error","Error while uploading File",null
            ))
    }
}

export default uploadFile;