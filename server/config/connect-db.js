import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.MONGODB_URI) {
    throw new Error("Please provide MONGODB_URI environment variable")
}

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected successfully to Mongodb !!")
    } catch(error) {
        console.log("Mongodb connection error", error)
        process.exit(1)
    }
}

export default connectDB