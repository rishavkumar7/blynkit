import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    },
    product_id : {
        type : mongoose.Schema.ObjectId,
        ref : "product"
    },
    quantity : {
        type : Number,
        default : 1
    }
}, {
    timestamps : true
})

const CartModel = mongoose.Model("cart", cartSchema)

export default CartModel