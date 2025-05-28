import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { addCategoryController, deleteCategoryController, getAllCategoriesController, updateCategoryController } from "../controllers/category.controller.js";

const categoryRoute = Router()

categoryRoute.post("/add", auth, addCategoryController)
categoryRoute.get("/get", auth, getAllCategoriesController)
categoryRoute.put("/update", auth, updateCategoryController)
categoryRoute.delete("/delete", auth, deleteCategoryController)

export default categoryRoute