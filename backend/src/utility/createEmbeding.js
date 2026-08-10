import {GoogleGenAI} from "@google/genai"


const ai = new GoogleGenAI({
    apiKey:process.env.Gemini_API_KEY
})

const createEmbeding = async (text)=>{
    try{
        const result =await ai.models.embedContent({
            model:"gemini-embedding-2",
            contents:text,
            config:{
                 outputDimensionality: 768
            }
        })

        return result.embeddings[0].values

    }
    catch(err){
       throw new Error("Failed to create embedding: " + err.message);
       
    }
}

export default createEmbeding;