import { Router } from "express"
import { loginUserController, logoutUserController, registerUserController, uploadUserAvatar, verifyEmailController, updateUserDetails, forgotPasswordController, verifyForgotPasswordOtp, resetPassword } from "../controllers/user.controller.js"
import auth from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"

const userRoute = Router()

userRoute.post("/register", registerUserController)
userRoute.post("/verify-email", verifyEmailController)
userRoute.post("/login", loginUserController)
userRoute.get("/logout", auth, logoutUserController)
userRoute.put("/upload-avatar", auth, upload.single("avatar"), uploadUserAvatar)
userRoute.put("/update-user", auth, updateUserDetails)
userRoute.put("/forgot-password", forgotPasswordController)
userRoute.put("/verify-forgot-password-otp", verifyForgotPasswordOtp)
userRoute.put("/reset-password", resetPassword)

export default userRoute