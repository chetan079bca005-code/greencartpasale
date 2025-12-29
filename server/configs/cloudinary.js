import {v2 as cloudinary} from "cloudinary";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log('Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    } catch (error) {
        console.error('Error configuring Cloudinary:', error);
        throw error;
    }
};

export default connectCloudinary;