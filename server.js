import express from "express"
import 'dotenv/config'
import cookieParser from "cookie-parser" 
import connectMongoDB from "./config/db.js"
import userRoute from "./routes/userRoutes.js"
import classRoute from "./routes/courseRoute.js"
import rewardRoute from "./routes/rewardRoute.js"

const app = express()
const port = process.env.PORT || 5100


connectMongoDB()
app.use(express.json())
app.use(cookieParser())
app.use("/api/users" , userRoute)
app.use("/api/classrooms" , classRoute)
app.use("/api/rewards" , rewardRoute)

app.listen(port , () => {
    console.log(`listening to port ${port}`)
})
