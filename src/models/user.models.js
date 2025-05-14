import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true//index vale ko tb likho jab bohot jyada searching involved ho is par varna mat kro kyunki yeh optimise to krta hai but performance costly hai to bohot jaruri to hi kro
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,//cloudinary url
            required: true
        },
        coverImage: {
            type: String,//  ''
        },
        watchHistory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    }, { timestamps: true }
)
//for password encryption
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//for comarinf the pass as user to string dega to use encrypted se compare kaise krenge to uska khud ka fx hai compare krne ka na dyeh ture false return kr dega
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)



/* interview q
Middleware ek function hota hai jo request (req) aur response (res) ke beech kaam karta hai.
1a)jwt ek bearer token ie jiske paas bhi iska key hai ie jo iska beare hai usko hi permission milegi
JWT = JSON Web Token. A compact, secure way to transmit data between client & server.
It contains 3 parts: header.payload.signature.
Generates a token with user info (not password!)
Signs it with a secret key
Token auto-expires (based on .env config)

1b)When access token expires, refresh token is used to get a new access token without logging in again.
Longer expiry time.
More secure because it's stored in httpOnly cookies.


2)A hook in Mongoose is a middleware that runs automatically before or after certain events — like save, update, etc.

3)jo pre vala hook hai
This is a "pre-save hook" (runs before saving user to DB).
If the password is not modified, skip encryption.
Else, encrypt it using bcrypt.hash(password, saltRounds).
saltRounds = 10 is standard level of security.
#we used function not()=> as this keyword ka access fx main hi hota hai and us
ke paas reference hone jaruri hai ki kis ki baat hoti














*/