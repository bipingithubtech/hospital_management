import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "datkot1fu",
  api_key: "296496785146721",
  api_secret: "n84ahqaugYvUfW_y7TfGKiJu3QM",
});

const uploadCloudinary = async (lacalPath) => {
  try {
    if (!lacalPath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(lacalPath, {
      resource_type: "auto",
    });

    console.log("cloudinary", uploadResult.url);
    // fs.unlinkSync(lacalPath);
    return uploadResult;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    // Remove the locally saved temporary file in case of failure
    if (fs.existsSync(lacalPath)) {
      fs.unlinkSync(lacalPath);
    }
    return null;
  }
};

export default uploadCloudinary;
