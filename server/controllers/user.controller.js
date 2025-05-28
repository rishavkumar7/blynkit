import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import UserModel from "../models/user.model.js"
import sendEmail from "../config/send-email.js"
import verifyEmailTemplate from "../utils/verify-email-template.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js"
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"
import generateOtp from "../utils/generateOtp.js"
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"

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

        const updateUser = await UserModel.findByIdAndUpdate(user._id, {
            last_login_date : new Date()
        })

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

export async function uploadUserAvatar(req, res) {
    try {
        const userId = req.userId
        const image = req.file
        const subfolder = req.body.subfolder || ""

        const upload = await uploadImageCloudinary(image, subfolder)

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar : upload.url
        })

        return res.status(200).json({
            message : "Image uploaded successfully !!",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })
    } catch(error) {
        return res.status(500).json({
            message : error?.message || error,
            success : false,
            error : true
        })
    }
}

export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId
        const { name, email, mobile, password } = req.body

        let hashPassword = ""
        if (password) {
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password, salt)
        }

        const userUpdate = await UserModel.updateOne({ _id : userId }, {
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return res.status(200).json({
            message : "User updated successfully !!",
            success : true,
            error : false,
            data : userUpdate
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message : "Invalid email",
                success : false,
                error : true
            })
        }

        const otp = generateOtp()
        const expireTime = new Date() + 60 * 60 * 1000  // 1hr

        const updateOtpDetails = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password email from Blynkit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return res.status(200).json({
            message : "otp sent successfully, please check your email",
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

export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({
                message : "Please provide the email and otp",
                success : false,
                error : true
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message : "Invalid email",
                success : false,
                error : true
            })
        }

        const currentTime = new Date().toISOString()
        if (currentTime > user.forgot_password_expiry) {
            return res.status(400).json({
                message : "Otp has expired",
                success : false,
                error : true
            })
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message : "Incorrect otp",
                success : false,
                error : true
            })
        }

        const userDetails = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })

        return res.status(200).json({
            message : "Otp verified successfully !!",
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

export async function resetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message : "Please provide the email, newPassword and confirmPassword to reset your password",
                success : false,
                error : true
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message : "Invalid email",
                success : false,
                error : true
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message : "Your new password and confirm password doesn't match",
                success : false,
                error : true
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        
        const updatePassword = await UserModel.findOneAndUpdate(user._id, {
            password : hashPassword
        })

        return res.status(200).json({
            message : "Your password has been reset successfully !!",
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

export async function refreshTokenController(req, res) {
    try {
        const refreshToken = req.cookies["refresh-token"] || req.headers?.authorization?.split(" ")[1]
        if (!refreshToken) {
            return res.status(400).json({
                message : "Please provide the refresh token",
                success : false,
                error : true
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (!verifyToken) {
            return res.status(400).json({
                message : "Invalid refresh token",
                success : false,
                error : true
            })
        }

        const userId = verifyToken?._id
        const newAccessToken = await generateAccessToken(userId)
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        res.cookie("access-token", newAccessToken, cookiesOption)

        return res.status(200).json({
            message : "New access token generated successfully !!",
            success : true,
            error : false,
            data : {
                accessToken : newAccessToken
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

export async function fetchUserDetails(req, res) {
    try {
        const userId = req.userId

        const user = await UserModel.findById(userId).select("-password -refresh_token")

        return res.status(200).json({
            message : "User details fetched successfully !!",
            success : true,
            error : false,
            data : user
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}