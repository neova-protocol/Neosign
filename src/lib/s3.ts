import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export async function uploadToS3(file: Buffer, fileName: string): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: 'application/pdf',
    });

    try {
        await s3Client.send(command);
        const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return url;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
} 