import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import connectDB from "./config/connect-db.js"
import userRoute from "./routes/user.route.js"

dotenv.config()

let app = express()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginOpenerPolicy : false
}))

app.get("/", (req, res) => {
    res.json({
        "message": "Get api hit successfully again",
        "success": "true"
    })
})

app.use("/api/user", userRoute)

const port = process.env.PORT || 9500

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log("Server is running...", port)
    })
})