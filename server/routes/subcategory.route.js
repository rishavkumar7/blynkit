import { Router } from "express"
import auth from "../middlewares/auth.middleware.js"
import { addSubcategoryController, deleteSubcategoryController, getAllSubcategoriesController, updateSubcategoryController } from "../controllers/subcategory.controller.js"

const subcategoryRoute = Router()

subcategoryRoute.post("/add", auth, addSubcategoryController)
subcategoryRoute.post("/get", getAllSubcategoriesController)
subcategoryRoute.put("/update", auth, updateSubcategoryController)
subcategoryRoute.delete("/delete", auth, deleteSubcategoryController)

export default subcategoryRoute