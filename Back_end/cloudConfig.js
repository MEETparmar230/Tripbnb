import {v2 as cloudinary} from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import dotenv from 'dotenv'
dotenv.config(); 

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
  folder: 'wanderlust',
  allowed_formats: ['jpg', 'png', 'jpeg' ,'avif'],
},
});

export {cloudinary}