import { convertAndUploadImage } from "./convertAndUpload.js";

export const processProfileImage = async (profileImageFile) => {
  try {
    console.log("Processing profile image:", profileImageFile);
    
    if (!profileImageFile || !profileImageFile.buffer) {
      throw new Error("Invalid file or missing buffer");
    }
    
    console.log("File details:", {
      fieldname: profileImageFile.fieldname,
      originalname: profileImageFile.originalname,
      mimetype: profileImageFile.mimetype,
      size: profileImageFile.size,
      hasBuffer: !!profileImageFile.buffer
    });
    
    const profilePicUrl = await convertAndUploadImage(
      profileImageFile.buffer, 
      profileImageFile.mimetype
    );
    
    console.log("Profile image uploaded successfully:", profilePicUrl);
    
    return { profilePicUrl };
  } catch (error) {
    console.error("Error in processProfileImage:", error);
    throw error;
  }
};