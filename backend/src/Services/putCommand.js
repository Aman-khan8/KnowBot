import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws.js";

export const uploadToS3 = async (file) => {
    const key = `documents/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
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