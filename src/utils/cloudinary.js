// load env variables in case this module is imported before index.js runs
import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //console.log("File uploaded to cloudinary successfully ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    try {
      fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed
    } catch (unlinkError) {
      console.log("Error removing temporary file ", unlinkError);
    }
    console.log("Error uploading file to Cloudinary ", error);
    return null;
  }
};

export { UploadOnCloudinary };
