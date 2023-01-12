import {v2 as cloudinary} from "cloudinary"
import * as dotenv from 'dotenv';
dotenv.config()

cloudinary.config({ 
    cloud_name: 'da9s9ok0k', 
    api_key: `${process.env.api_key_cloudinary}`, 
    api_secret: `${process.env.API_SECRET_CLOUDINARY}` 
  });

export{
    cloudinary
}