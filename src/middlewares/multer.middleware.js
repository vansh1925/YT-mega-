//we are using disk storage not memory storage
//multer ka use hai file ko apne device pe locally store krna 
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) { //destination is a function that tells Multer where to save the uploaded file. and "Save the uploaded file in ../Public/Temp folder." 
    cb(null, "Public/Temp")
  },
  filename: function (req, file, cb) {  //filename is a function to set how the file should be named when saved. and Save the file using its original name."
    cb(null, file.originalname)//can be updated after
  }
})

export const upload = multer({ storage })



//Use memoryStorage when your goal is to upload the file to Cloudinary/S3
//  right away and you don’t need to store it locally.
//Use diskStorage when you want a local copy for backup, processing, or logging.

/*
why to use both (multer,cloudinary)

Step	What happens?	Who handles it?
1️⃣	User uploads a file (e.g., profile pic)	Frontend sends it to backend via form-data
2️⃣	Backend receives that file	✅ Multer parses it (Express doesn’t do this natively)
3️⃣	File is saved temporarily (or held in memory)	✅ Multer (stores locally or in memory)
4️⃣	You upload this file to Cloudinary	✅ Cloudinary API handles this
5️⃣	Cloudinary gives you a secure_url	✅ Save this in MongoDB for user profile, etc.
6️⃣	(Optional) Delete the local temp file	✅ To clean up disk space


🧠 Why can’t we skip Multer?
Because:

Express doesn’t understand multipart/form-data (used for file uploads)

You need Multer to extract the file from the request before sending to Cloudinary

🧠 Why can’t we skip Cloudinary?
Because:

Storing files locally on your server is a bad practice for production:

No CDN (slow delivery)

No auto-resizing

Scalability issues

Cloudinary provides:

Fast CDN hosting

Automatic transformations

Secure access*/