//iska use hai ki jo multer se file save hui hai device pe vahan se uthake cloudinary pe ave krna aur use device se selete kr dena
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAM,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const upload = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
            console.log("FilePath not found")
        }
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded on clodinary", response.url);
        return response;
    }
    catch (error) {
        fs.unlincSync(localFilePath)//remove krdega file as hum jo ya jo industry level pe hota
        //  hai vo yeh hai ki pehale file humare server pe store hoti hai aur vahan se cloudinary 
        // ke server pe jaati hai to humare server se delete krna jaruri hai taaki malacious cheej na aa jaaye in short.
        return null

    }
}






















//file system import nhi krna parta