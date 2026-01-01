import {v2 as Cloudinary} from "cloudinary"
    
Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export default Cloudinary