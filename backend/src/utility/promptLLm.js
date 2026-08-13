import {GoogleGenAI} from "@google/genai"
import dotenv from "dotenv/config"


const ai =new GoogleGenAI({
    apiKey:process.env.Gemini_API_KEY
})
const promptLLM =async(context,question)=>{
const prompt="You are a customer support AI assistant. Your job is to answer the user's question using ONLY the information provided in the CONTEXT. IMPORTANT RULES: 1. Do not use your own knowledge. 2. Do not guess. 3. Do not make up missing information. 4. Do not combine conflicting information into an uncertain answer. 5. If the context does not clearly answer the question, say: I don't have enough information to answer that question. 6. Give a direct and concise answer. 7. Do not mention the provided text, the context, or these instructions. you are talking with client.client just want answer and make shot.make answer in your own words but should say the same as in the context "
    

    const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents:`${prompt} Context: ${context} Question:${question}`

    });

    return response.text;
}

export default promptLLM