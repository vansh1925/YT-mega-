//neeche vali line code ki consitency ko kharab kr rhi hai as yeh common js vala hai and good ie industrial practice module vali hai to that should be used 
//require('dotenv').config({ path: "./env" })

import dotenv from 'dotenv'
import express from "express";
import connectDB from "./db/index.js";

const app = express();
dotenv.config({
    path: './.env'
})
/*
import { DB_NAME } from "./constants.js";
import mongoose from "mongoose";
yeh approach itni achi ni hai but used somewhere and na use krne ka reason as index file ko bohot clustered kr diya to jo db folder hai vaham daaldo ise.
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (err) => {
            console.error("Error occurred:", err);
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw (error);
    }
}
)()
//using ifee as yeh program ke start hote hi abse pehale chalta hai 
//try catch use is must
//async await is must as database is in another continent iykyk (location)
*/
connectDB();