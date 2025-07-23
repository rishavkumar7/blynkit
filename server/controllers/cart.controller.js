import CartModel from "../models/cart.model.js"
import UserModel from "../models/user.model.js"

export const addItemToCartController = async (req, res) => {
    try {
        const user_id = req.userId
        const { product_id } = req.body
        if (!user_id || !product_id) {
            return res.status(400).json({
                message : "Please provide both user_id and product_id",
                success : false,
                error : true
            })
        }

        const countItemInCart = await CartModel.countDocuments({ 
            user_id, 
            product_id 
        })
        if (countItemInCart !== 0) {
            return res.status(400).json({
                message : "This item is already present in cart.",
                success : false,
                error : true
            })
        } 

        const addedProductToCart = await CartModel.create({
            user_id,
            product_id,
            quantity: 1
        })

        const updateUserShoppingCart = await UserModel.findByIdAndUpdate(user_id, {
            $push : { shopping_cart : addedProductToCart?._id }
        })

        return res.status(200).json({
            message : "Product added to cart successfully !!",
            success : true,
            error : false,
            data : addedProductToCart
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const getCartItemsController = async (req, res) => {
    try {
        const user_id = req.userId
        if (!user_id) {
            return res.status(400).json({
                message : "Please provide the user_id",
                success : false,
                error : true
            })
        }

        const cartItems = await UserModel.findById(user_id).select("shopping_cart").populate({ 
            path : "shopping_cart",
            select : "-user_id",
            populate : {
                path : "product_id"
            }
        })

        const updatedCartItems = {}
        updatedCartItems.user_id = cartItems?._id
        updatedCartItems.shopping_cart = cartItems?.shopping_cart.map(cartItem => {
            return {
                cart_item_id : cartItem?._id,
                product : cartItem?.product_id,
                quantity : cartItem?.quantity,
                createdAt : cartItem?.createdAt,
                updatedAt : cartItem?.updatedAt
            }
        })

        return res.status(200).json({
            message : "Cart items fetched successfully !!",
            success : true,
            error : false,
            data : updatedCartItems
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const updateCartItemQuantityController = async (req, res) => {
    try {
        const user_id = req.userId
        const { product_id, quantity } = req.body
        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({
                message : "Please provide the user_id, product_id and quantity",
                success : false,
                error : true
            })
        }

        const updatedCartItem = await CartModel.updateOne({ user_id : user_id, product_id : product_id }, {
            quantity
        })

        return res.status(200).json({
            message : "Cart item quantity updated successfully !!",
            success : true,
            error : false,
            data : updatedCartItem
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const deleteItemFromCartController = async (req, res) => {
    try {
        const user_id = req.userId
        const { product_id } = req.body
        if (!product_id || !user_id) {
            return res.status(400).json({
                message : "Please provide the product_id and user_id",
                success : false,
                error : true
            })
        }

        const cartItemInfo = await CartModel.findOne({ user_id : user_id, product_id : product_id })
        
        if (cartItemInfo?.product_id?.toString() !== product_id) {
            return res.status(400).json({
                message : "This product does not exist in cart.",
                success : false,
                error : true
            })
        }

        const deletedCartItem = await CartModel.deleteOne({ user_id : user_id, product_id : product_id })

        const updateUserShoppingCart = await UserModel.updateOne({ _id : user_id }, {
            $pull : { shopping_cart : cartItemInfo?._id }
        })

        return res.status(200).json({
            message : "Cart Item deleted successfully !!",
            success : true, 
            error : false,
            data : deletedCartItem
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}