import ProductModel from "../models/product.model.js"
import SubcategoryModel from "../models/subcategory.model.js"

export const addSubcategoryController = async (req, res) => {
    try {
        const { name, image, category } = req.body

        if (!(name && image && category[0])) {
            return res.status(400).json({
                message : "Please provide the subcategory's name, image and categories",
                success : false,
                error : true
            })
        }

        const subcategory = new SubcategoryModel({
            name,
            image,
            category
        })

        const save = await subcategory.save()

        return res.status(200).json({
            message : "Subcategory saved successfully !!",
            success : true,
            error : false,
            data : save
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const getAllSubcategoriesController = async (req, res) => {
    try {
        const subcategories = await SubcategoryModel.find().sort({ createdAt : -1 }).populate("category")

        return res.status(200).json({
            message : "Subcategories fetched successfully !!",
            success : true,
            error : false,
            data : subcategories
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const updateSubcategoryController = async (req, res) => {
    try {
        const { _id, name, image, category } = req.body

        const existingSubcategory = await SubcategoryModel.findById(_id)
        if (!existingSubcategory) {
            return res.status(400).json({
                message : "Subcategory not found !!",
                success : false,
                error : true
            })
        }

        const updatedSubcategory = await SubcategoryModel.findByIdAndUpdate(_id, { name, image, category })

        return res.status(200).json({
            message : "Subcategory updated successfully !!",
            success : true,
            error : false,
            data : updatedSubcategory
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const deleteSubcategoryController = async (req, res) => {
    try {
        const { _id } = req.body

        const productCount = await ProductModel.find({
            sub_category : {
                "$in" : _id
            }
        }).countDocuments()

        if (productCount > 0) {
            return res.status(400).json({
                message : "This subcategory cannot be deleted as this subcategory is in use",
                success : false,
                error : true
            })
        }

        const deleteSubcategory = await SubcategoryModel.deleteOne({ _id : _id})

        return res.status(200).json({
            message : "Subcategory deleted successfully !!",
            success : true,
            error : false,
            data : deleteSubcategory
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}