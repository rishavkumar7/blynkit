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