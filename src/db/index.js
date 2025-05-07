import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        //we can store this in a variable as it g=returns a response 
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDb connected and DB HOST : ${connectionInstance.connection.host}`)
    }
    catch (error) {
        console.log("MongoDB connection failed", error)
        process.exit(1);//a method to exit the process
    }
}
export default connectDB;