import { convertAndUploadImage } from "./convertAndUpload.js";
import { JSDOM } from "jsdom";

export const processPostImages = async (coverImageFile, contentHTML) => {
  let coverImageURL = null;
  
  // Handle cover image - now accepting multer file object
  if (coverImageFile) {
    coverImageURL = await convertAndUploadImage(coverImageFile.buffer, coverImageFile.mimetype);
  }

  // Handle content images
  const dom = new JSDOM(contentHTML);
  const document = dom.window.document;
  const imgTags = document.querySelectorAll("img");

  for (const img of imgTags) {
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image")) {
      const uploadedURL = await convertAndUploadImage(src, "image/*");
      img.setAttribute("src", uploadedURL);
    }
  }

  return {
    coverImageURL,
    updatedContent: document.body.innerHTML,
  };
};