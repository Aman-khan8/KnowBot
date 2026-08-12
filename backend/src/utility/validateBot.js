import pool from "../Config/DBConfig.js";



const validateBot =async(botId,userId)=>{
    try {
        const query="SELECT id from bots WHERE id =$1 AND user_id = $2"
        const result = await pool.query(query,[botId,userId])
        if(result.rowCount>0){
            return true;
        }
        return false;

    } catch (error) {
       
  throw new Error(`Error in validating Bot: ${error.message}`, { cause: error });

    }
}

export default validateBot