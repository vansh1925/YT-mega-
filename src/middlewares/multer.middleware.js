//we are using disk storage not memory storage
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Public/Temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)//can be updated after
  }
})

export const upload = multer({ storage })
