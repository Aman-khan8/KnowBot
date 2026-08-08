import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../Config/AWSConfig.js";

export const uploadToS3 = async (file) => {
    const key = `documents/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3.send(command);

    return {
        key,
        fileName: file.originalname,
        fileType: file.mimetype,
    };
};