import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const CLOUDFRONT_URL = process.env.AWS_CLOUD_FRONT_NAME;

export const uploadToS3 = async (buffer, mimetype) => {
  const key = `posts/${randomUUID()}.avif`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "image/avif",
    })
  );

  return `https://${CLOUDFRONT_URL}/${key}`;
};
