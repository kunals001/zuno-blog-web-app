import { convertAndUploadImage } from "./convertAndUpload.js";
import { JSDOM } from "jsdom";

export const processPostImages = async (coverImageBase64, contentHTML) => {
  let coverImageURL = null;
  if (coverImageBase64) {
    coverImageURL = await convertAndUploadImage(coverImageBase64, "image/*");
  }

  const dom = new JSDOM(contentHTML);
  const document = dom.window.document;
  const imgTags = document.querySelectorAll("img");

  for (const img of imgTags) {
    const src = img.getAttribute("src");
    if (src.startsWith("data:image")) {
      const uploadedURL = await convertAndUploadImage(src, "image/*");
      img.setAttribute("src", uploadedURL);
    }
  }

  return {
    coverImageURL,
    updatedContent: document.body.innerHTML,
  };
};
