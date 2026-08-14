import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../Config/AWSConfig.js";


const getDocumentUrl =async(s3Key) =>{

    const command = new GetObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
        Key:s3Key
    })

     const url = await getSignedUrl(s3, command, {
        expiresIn: 3600
    });

    return url;

};

export default getDocumentUrl