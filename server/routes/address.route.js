import { Router } from "express"
import auth from "../middlewares/auth.middleware.js"
import { addAddressController, deleteAddressController, getAddressController, updateAddressController } from "../controllers/address.controller.js"

const addressRoute = Router()

addressRoute.post("/add", auth, addAddressController)
addressRoute.get("/get", auth, getAddressController)
addressRoute.put("/update", auth, updateAddressController)
addressRoute.delete("/delete", auth, deleteAddressController)

export default addressRoute