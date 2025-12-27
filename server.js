import express from "express"
import 'dotenv/config'
import cookieParser from "cookie-parser" 
import connectMongoDB from "./config/db.js"
import userRoute from "./routes/userRoutes.js"

const app = express()
const port = process.env.PORT

connectMongoDB()
app.use(express.json())
app.use(cookieParser())
app.use("/api/users" , userRoute)


app.listen(port , () => {
    console.log(`listening to port ${port}`)
})
