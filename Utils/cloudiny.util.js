import cloudinary from 'cloudinary'
import fs from 'fs'

cloudinary.v2.config({
    cloud_name: 'dfkgzdnnc',
    api_key: '955313683614897',
    api_secret: 'pm6pb-ceo1ai2vgfXfGQ_7kY8E0',
    secure: true,
});


// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        fs.unlinkSync(localFilePath);
        console.log("Upload successful");
        return response.secure_url;
    } catch (error) {
        console.log("Error uploading to Cloudinary:", error.message);
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export { uploadOnCloudinary };
