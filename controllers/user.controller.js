import bcrypt from "bcryptjs"
import UserModel from "../models/user.model.js"
import sendEmail from "../config/send-email.js"
import verifyEmailTemplate from "../utils/verify-email-template.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js"

export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                message : "Please provide the name, email, password while registering",
                success : false,
                error : true
            })
        }

        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({
                message : "Email is already registered previously",
                success : false,
                error : true
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const payload = {
            name,
            email,
            password : hashPassword
        }

        const newUser = new UserModel(payload)
        const saved = await newUser.save()

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${saved?._id}`
        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verification Email from Blynkit",
            html : verifyEmailTemplate({
                name,
                url : verifyEmailUrl
            })
        })

        return res.status(200).json({
            message : "User Registered Successfully !!",
            success : true,
            error : false,
            data : saved
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body

        const user = await UserModel.findOne({ _id : code })
        if (!user) {
            return res.status(400).json({
                message : "Invalid code received while verifying the email",
                success : false,
                error : true
            })
        }

        const updateUser = await UserModel.updateOne({ _id : code }, {
            verify_email : true
        })

        return res.status(200).json({
            message : "Email verified successfully",
            success : true,
            error : false
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export async function loginUserController(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message : "Please provide the email and password to login",
                success : false,
                error : true
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message : "No user found with this email",
                success : false,
                error : true
            })
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message : "This account is not active currently. Please contact the admin to activate.",
                success : false,
                error : true
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message : "Password doesn't match",
                success : false,
                error : true
            })
        }

        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.cookie("access-token", accessToken, cookiesOption)
        res.cookie("refresh-token", refreshToken, cookiesOption)
        return res.status(200).json({
            message : "Logged in Successfully !!",
            success : true,
            error : false,
            data : {
                accessToken,
                refreshToken
            }
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export async function logoutUserController(req, res) {
    try {
        const userId = req.userId

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("access-token", cookiesOption)
        res.clearCookie("refresh-token", cookiesOption)
        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token : ""
        })

        return res.status(200).json({
            message : "Logged out successfully !!",
            success : true,
            error : false
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}