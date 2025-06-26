import ProductModel from "../models/product.model.js"

export const createProductController = async (req, res) => {
    try {
        const { name, image, category, sub_category, unit, stock, price, discount, description, more_details, publish } = req.body
        if (!name || !image[0] || !category[0] || !sub_category[0] || !unit || !price || !description || !publish) {
            return res.status(400).json({
                message : "Product's required fields are missing",
                success : false,
                error : true
            })
        }

        const product = new ProductModel({
            name,
            image,
            category,
            sub_category,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            publish
        })
        const savedProduct = await product.save()

        return res.status(200).json({
            message : "Product created successfully !!",
            success : true,
            error : false,
            data : savedProduct
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const getProductController = async (req, res) => {
    try {
        let { page, limit, filterOptions } = req.body

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 50
        }

        const skip = (page-1) * limit
        const query = filterOptions?.search ? {
            "$text" : {
                "$search" : filterOptions?.search
            }
        } : {}

        if (filterOptions?.categories[0]) {
            query.category = {
                "$in" : filterOptions?.categories
            }
        }

        if (filterOptions?.subcategories[0]) {
            query.sub_category = {
                "$in" : filterOptions?.subcategories
            }
        }
        
        const [ data, totalCount ] = await Promise.all([
            ProductModel.find(query).sort({ createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return res.status(200).json({
            message : "Products fetched successfully !!",
            success : true,
            error : false,
            totalCount : totalCount,
            pageCount : Math.ceil( totalCount / limit ),
            data : data
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const updateProductController = async(req, res) => {
    try {
        const { _id, name, image, category, sub_category, unit, stock, price, discount, description, more_details, publish } = req.body

        const existingProduct = await ProductModel.findById(_id)
        if (!existingProduct) {
            return res.status(400).json({
                message : "No such Product exists !!",
                success : false,
                error : true
            })
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(_id, { name, image, category, sub_category, unit, stock, price, discount, description, more_details, publish })
        return res.status(200).json({
            message : "Product updated successfully !!",
            success : true,
            error : false,
            data : updatedProduct
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const deleteProductController = async(req, res) => {
    try {
        const { _id } = req.body

        const existingProduct = await ProductModel.findById(_id)
        if (!existingProduct) {
            return res.status(400).json({
                message : error.message || error,
                success : false,
                error : true
            })
        }

        const deletedProduct = await ProductModel.deleteOne({ _id : _id })
        return res.status(200).json({
            message : "Product Deleted Successfully !!",
            success : true,
            error : false,
            data : deletedProduct
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}