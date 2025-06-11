import { Router } from "express"
import auth from "../middlewares/auth.middleware.js"
import { createProductController } from "../controllers/product.controller.js"

const productRoute = Router()

productRoute.post("/add", auth, createProductController)

export default productRoute