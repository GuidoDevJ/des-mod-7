import { cloudinary } from "../lib/cloudynary"

export const uploadImage=async(url)=>{
    try {
        const result = await cloudinary.uploader.upload(url,{
            resource_type:"image",
            discard_original_filename:true,
            width:1000
        })
    return(result.secure_url)
    } catch (error) {
        return(error)
    }
}