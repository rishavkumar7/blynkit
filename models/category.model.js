import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    }
}, {
    timestamps : true
})

const CategoryModel = mongoose.Model("category", categorySchema)

export default CategoryModel