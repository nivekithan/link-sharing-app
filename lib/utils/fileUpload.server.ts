import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";
import crypto from "node:crypto";
import { Config } from "sst/node/config";

export async function uploadFileToS3(file: File) {
  const key = crypto.randomUUID();
  const command = new PutObjectCommand({
    Body: await file.arrayBuffer(),
    Bucket: Bucket.profilePicture.bucketName,
    Key: key,
    ContentType: file.type,
  });

  const s3Client = new S3Client();

  await s3Client.send(command);

  const url = `https://${Bucket.profilePicture.bucketName}.s3.${Config.AWS_REGION_NAME}.amazonaws.com/${key}`;

  return url;
}
