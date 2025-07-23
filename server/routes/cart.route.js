import { Router } from "express"
import auth from "../middlewares/auth.middleware.js"
import { addItemToCartController, deleteItemFromCartController, getCartItemsController, updateCartItemQuantityController } from "../controllers/cart.controller.js"

const cartRoute = Router()

cartRoute.post("/add-item", auth, addItemToCartController)
cartRoute.get("/get-items", auth, getCartItemsController)
cartRoute.put("/update-quantity", auth, updateCartItemQuantityController)
cartRoute.delete("/delete-item", auth, deleteItemFromCartController)

export default cartRoute