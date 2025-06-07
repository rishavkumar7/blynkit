import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubcategoryModel from "../models/subcategory.model.js";

export const addCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body
        if (!name || !image) {
            return res.status(400).json({
                message : "Please provide the category name and category image",
                success : false,
                error : true
            })
        }

        const newCategory = new CategoryModel({
            name,
            image
        })

        const savedCategory = await newCategory.save()
        if (!savedCategory) {
            return res.status(500).json({
                message : "Failed to save the new category",
                success : false,
                error : true
            })
        }

        return res.status(200).json({
            message : "Category added successfully !!",
            success : true,
            error : false,
            data : savedCategory
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await CategoryModel.find().sort({ createdAt : -1 })

        return res.status(200).json({
            message : "Categories fetched successfully !!",
            success : true,
            error : false,
            data : categories
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { _id, name, image } = req.body

        const update = await CategoryModel.updateOne({ _id : _id }, {
            name,
            image
        })

        return res.status(200).json({
            message : "Category updated successfully !!",
            success : true,
            error : false,
            data : update
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body

        const subcategoryCount = await SubcategoryModel.find({
            category : {
                "$in" : _id
            }
        }).countDocuments()

        const productCount = await ProductModel.find({
            category : {
                "$in" : _id
            }
        }).countDocuments()

        if (subcategoryCount > 0 || productCount > 0) {
            return res.status(400).json({
                message : "Cannot delete this category as this category is in use",
                success : false, 
                error : true
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id : _id })

        return res.status(200).json({
            message : "Deleted the category successfully !!",
            success : true,
            error : false,
            data : deleteCategory
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}