import { Router } from "express"
import { loginUserController, logoutUserController, registerUserController, verifyEmailController } from "../controllers/user.controller.js"
import auth from "../middlewares/auth.middleware.js"

const userRoute = Router()

userRoute.post("/register", registerUserController)
userRoute.post("/verify-email", verifyEmailController)
userRoute.post("/login", loginUserController)
userRoute.get("/logout", auth, logoutUserController)

export default userRoute