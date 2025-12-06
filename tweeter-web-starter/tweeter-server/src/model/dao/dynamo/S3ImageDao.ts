import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { ImageDao } from "../ImageDao";
const REGION = "us-east-1"; // adjust to your region
const BUCKET_NAME = "landonwhitaker-tweeter-bucket"; // replace with your bucket

const s3Client = new S3Client({ region: REGION });

export class S3ImageDao implements ImageDao {
  public async uploadImage(
    key: string,
    imageBytes: Uint8Array,
    extension: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBytes,
      ContentType: extension,
    });

    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
  }

  public async deleteImage(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
  }
}
