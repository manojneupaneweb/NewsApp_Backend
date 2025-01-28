import cloudinary from 'cloudinary';
import fs from 'fs';

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: 'dfkgzdnnc',
    api_key: '955313683614897',
    api_secret: 'pm6pb-ceo1ai2vgfXfGQ_7kY8E0',
    secure: true,
});

// Function to upload an image to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        // Optionally delete the local file after uploading
        fs.unlinkSync(localFilePath);  
        console.log("Upload successful");
        return response.secure_url;  // Return the Cloudinary URL of the uploaded image
    } catch (error) {
        console.log("Error uploading to Cloudinary:", error.message);
        // Clean up by deleting the file in case of an error
        fs.unlinkSync(localFilePath);
        return null;
    }
};

// Function to delete an image from Cloudinary by its public ID
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary Delete Result:', result);
        return result;  // Return the result of the delete operation
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Error deleting image from Cloudinary');
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
