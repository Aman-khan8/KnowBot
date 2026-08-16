import s3 from "../Config/AWSConfig.js";
import ApiResponse from "../utility/ApiResponse.js"
import {uploadToS3} from "../Services/putCommand.js"
import pool from "../Config/DBConfig.js"
import createChunks from "../utility/createChunking.js"
import extractText from "../utility/extractText.js"
import createEmbeding from "../utility/createEmbeding.js";
import validateBot from "../utility/validateBot.js";

const uploadFile=async(req,res)=>{

    try{
        const file=req.file;
        const botId=req.params.id
        const userId=req.user.rows[0].id
        if(!file){
            return res.status(400).json(new ApiResponse(
                400,"error","No file uploaded",null
            ))

        }
          if(!validateBot(botId,userId)) {
          return res.status(401).json(new ApiResponse(
                401,"error","you have no access over this bot",null
            ))

          }
        const text=await extractText(file.buffer)
        const cleanText = text.replace(/--\s*\d+\s+of\s+\d+\s*--/g, "");
        const chunks=createChunks(cleanText,100,10)
    

        const result = await(uploadToS3(file,req.user.rows[0].id))
        if(!result){
            return res.status(500).json(new ApiResponse(
                500,"error","Failed to upload successfully",null
            ))
        }

       const query="INSERT INTO documents (bot_id,file_name,s3_key) VALUES($1,$2,$3) RETURNING *"
      const values=[botId,result.fileName,result.key]
      const dbResult=await pool.query(query,values)
      if(dbResult.rowCount===0){
        return res.status(402).json(new ApiResponse(
                402,"error","Failed to save file information",null
            ))
      }
      const Embedquery="INSERT INTO document_chunks(document_id,chunk_text,embedding,chunk_index) VALUES ($1,$2,$3,$4)"
      let i=0;
      for(const chunk of chunks){
      const embeding = await createEmbeding(chunk)
      const vector = `[${embeding.join(",")}]`;
       const embedResult = await pool.query(Embedquery,[dbResult.rows[0].id,chunk,vector,i])
       i+=1;
      }        

       return res.status(201).json(new ApiResponse(
                201,"success","File uploaded successfully",dbResult.rows[0]
            )) 
    }
    catch(err){
        return res.status(400).json(new ApiResponse(
                400,"error",err.message,null
            ))
    }
} 



export default uploadFile;