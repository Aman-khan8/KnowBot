import pool from "../Config/DBConfig.js"
import createEmbed from "../utility/createEmbeding.js"
import ApiResponse from "../utility/ApiResponse.js";
import createAnswer from "../utility/promptLLm.js"

const QuestionEmbed=async(req,res)=>{
    try{
        const{question,botId}=req.body;
         
        let embedQuestion= await createEmbed(question)
                embedQuestion = `[${embedQuestion.join(",")}]`;
    
        
        const query= "SELECT dc.id AS chunk_id, dc.document_id,dc.chunk_text, dc.chunk_index,dc.embedding <=> $2 AS distance  FROM document_chunks dc JOIN documents d ON dc.document_id = d.id WHERE d.bot_id = $1 ORDER BY dc.embedding <=> $2 LIMIT 3"

        const values=[botId , embedQuestion]

        const result = await pool.query(query,values)
const context = result.rows
    .map(row => row.chunk_text)
    .join("\n\n");
        let answer = await createAnswer(context,question)
        
        answer=answer.replace(/--\s*\d+\s+of\s+\d+\s*--/g, "");
        

        return res.status(200).json(new ApiResponse(200,"sucess","Answer is generated", answer))
    }
    catch(err){
        return res.status(500).json(new ApiResponse(500,"error",err.message,null))
    }
}


export default QuestionEmbed