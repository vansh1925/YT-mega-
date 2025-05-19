import { Router } from "express"
import { loginUser, logOutUser, registerUser } from "../controller/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()
router.route("/register").post(
    /*as upload in multer ek middleware hai to 
    inhe aise jhi use kiya jata hai ki register hone se pehale isko karo 
    and fields use kiya hai as 
    and do obj means ki hame do type of image deni hai ek avatar, ek cover imagecount main ki kitni hongi
    and name ki vo kis name se save hingi (frontend main bhi)*/
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser

)
router.route("/login").post(loginUser)

//secured route(jinke liye login hona padega)
router.route("/logout").post(verifyJwt, logOutUser)
router.route("/refresh-token").post(refreshTokenUser)

router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/current-user").get(verifyJwt, getCurrentUser)
router.route("/update-account").patch(verifyJwt, updateAccountDetails)

router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJwt, getUserChannelProfile)
router.route("/history").get(verifyJwt, getWatchHistory)
export default router

