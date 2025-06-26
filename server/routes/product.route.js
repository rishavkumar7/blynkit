import { Router } from "express"
import auth from "../middlewares/auth.middleware.js"
import { createProductController, deleteProductController, getProductController, updateProductController } from "../controllers/product.controller.js"

const productRoute = Router()

productRoute.post("/add", auth, createProductController)
productRoute.post("/get", getProductController)
productRoute.put("/update", auth, updateProductController)
productRoute.delete("/delete", auth, deleteProductController)

export default productRoute