//iska use hai ki jo multer se file save hui hai device pe vahan se uthake cloudinary pe ave krna aur use device se selete kr dena
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    //yahan ek bug aara hai and i have tried too much ki if api key ko env se lun to vo kaam nhi kr rha
    cloud_name: "db0mh9nu0",
    api_key: "157638312842167",
    api_secret: "UvA1SKuJpcHksJFQrXm-t-Pxy6U"
});

export const upload = async (localFilePath) => {


    try {
        if (!localFilePath) {
            console.log("FilePath not found")
            return null

        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded on clodinary", response.url);
        console.log("Cloudinary upload response:", response);
        return response;
    }
    catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath)//remove krdega file as hum jo ya jo industry level pe hota
        //  hai vo yeh hai ki pehale file humare server pe store hoti hai aur vahan se cloudinary 
        // ke server pe jaati hai to humare server se delete krna jaruri hai taaki malacious cheej na aa jaaye in short.
        return null

    }
}






















//file system import nhi krna parta