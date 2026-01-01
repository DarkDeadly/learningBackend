import express from "express"
import 'dotenv/config'
import cookieParser from "cookie-parser" 
import connectMongoDB from "./config/db.js"
import userRoute from "./routes/userRoutes.js"
import classRoute from "./routes/courseRoute.js"
import rewardRoute from "./routes/rewardRoute.js"
import cors from "cors"
import job from "./config/cron.js"
const app = express()
const port = process.env.PORT || 5100

app.use(cors({
    origin: '*',  // Allow all origins for mobile app
    credentials: true
}));
if (process.env.NODE_ENV === "production") job.start()
connectMongoDB()
app.use(express.json())
app.use(cookieParser())
app.use("/api/users" , userRoute)
app.use("/api/classrooms" , classRoute)
app.use("/api/rewards" , rewardRoute)


// 🆕 Health check endpoint
app.get("/health", (req, res) => {
    res.json({ message: "Education API is running! 🎓" });
});


app.listen(port , () => {
    console.log(`listening to port ${port}`)
})
