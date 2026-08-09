import {DeleteObjectCommand} from "@aws-sdk/client-s3"
import s3 from "../Config/AWSConfig.js"


const deleteFromS3=async(document,userId)=>{

    console.log()
    const command=new DeleteObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:document.s3_key
    })
    await s3.send(command)
    return {
        key:document.s3_key,
        fileName:document.originalname
    }
}

export default deleteFromS3