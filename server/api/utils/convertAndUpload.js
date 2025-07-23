import sharp from "sharp";
import { uploadToS3 } from "./s3.js";

export const convertAndUploadImage = async (base64OrBuffer, mimetype) => {
  const buffer =
    typeof base64OrBuffer === "string"
      ? Buffer.from(base64OrBuffer.split(",")[1], "base64")
      : base64OrBuffer;

  const avifBuffer = await sharp(buffer)
    .avif({ quality: 50 })
    .toBuffer();

  const url = await uploadToS3(avifBuffer, "image/avif");
  return url;
};
