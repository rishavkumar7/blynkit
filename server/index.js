import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import connectDB from "./config/connect-db.js"
import userRoute from "./routes/user.route.js"
import categoryRoute from "./routes/category.route.js"
import uploadRoute from "./routes/upload.route.js"
import subcategoryRoute from "./routes/subcategory.route.js"

dotenv.config()

let app = express()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.urlencoded({ extended: true }));
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
app.use("/api/category", categoryRoute)
app.use("/api/file", uploadRoute)
app.use("/api/subcategory", subcategoryRoute)

const port = process.env.PORT || 9500

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log("Server is running...", port)
    })
})