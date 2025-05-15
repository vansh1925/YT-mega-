import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
export const verifyJwt = asyncHandler(async (req, _, next) => {//jb bhi koi cheej na use ho to production main use _ kr dete hain jaise yahan response
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        /*yahan humne pehale req se cookies ka access liya as yaad hoga ki middleware yhi krta hai ki
         vo aur cheeje add kr deta hai then un cookies se accessToken ka access liya
         aur dusra vo jo mobile apps hai unke loiye hai ki vo postman se auth vala header lengi and 
         generally jwt token ko Bearer likh ke start krte hain like Bearer jshiuahi.. to 
         now humne replace krdiya 'Bearer ' ko "" se ie kuch ni to seedha token mil jaaega*/
        if (!token) {
            throw new ApiError(401, "unauthorized request")
        }
        //now ab if token mil gya to use verify kro
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")//yeh _id password refreshToken humne models main di thi jwt ko to unko hata diya ki vo na aaye _id ki help se
        if (!user) {
            throw new ApiError(401, "invalid Access Token")
        }
        req.user = user //To attach the authenticated user to the request object, so it’s accessible in the next middleware/controller.


        next()

        //next is used for transferrinf the flow to the next middleware
        // Concept       	Meaning
        // next()	    Passes control to the next middleware/route
        // next(err)	Passes error to the central error handler
        // If next()    missing	The request hangs, response is never sent
        // Used in	Middlewares (auth, logging, parsing, validation, etc.)

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")

    }






})  