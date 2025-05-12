import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//middlewares
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))
app.use(express.json({ limit: "16kb" }))//used taaki server pe kuck limited json hi aaye varna server to bhar hi jaayega
app.use(express.urlencoded({ extended: true, limit: "16kb" }))//used taaki jo url hota hai to vahan + main ya %20 aise hota hai to vo read kr le aaram se backend
app.use(express.static('public'))//taaki jo bhi pdf image favicon hai vo alag se store ho jaaye  like something something
app.use(cookieParser())//cookies par CRUD operation kr ne ke liye
//app.get app.post ke alawa jab bhi yeh cookies ya middleware ka kaam ho tab app.use hi use hota hai



//import routes
import userRouter from './routes/user.routes.js'
//yahan manchaha naam tb hi de skte ho jab default export kiya ho tb hi
//route declaration
app.use("/api/v1/users", userRouter)



export { app }