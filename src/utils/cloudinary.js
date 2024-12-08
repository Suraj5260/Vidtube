import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from "dotenv"

dotenv.config()

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, tag) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(
      localFilePath, {
      resource_type: 'auto',
      tags: [tag],
    }
    )
    console.log("File uploaded on cloudinary.file src:" + response.url);

    // once the file is uploaded we would like to delete it from our servers
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    console.log("Error on Cloudinary:", error);
    fs.unlinkSync(localFilePath)
    return null
  }
}

const deleteFromClodinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log("Deleted from cloudinary, public ID:", publicId);

  } catch (error) {
    console.log("Error deleting from cloudinary", error);
    return null
  }
}

export { uploadOnCloudinary, deleteFromClodinary }