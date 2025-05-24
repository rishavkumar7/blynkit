import mongoose from "mongoose"

const subcategorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    }, 
    image : {
        type : String,
        default : ""
    },
    category : [{
        type : mongoose.Schema.ObjectId,
        ref : "category"
    }]
}, {
    timestamps : true
})

const SubcategoryModel = mongoose.Model("sub_category", subcategorySchema)

export default SubcategoryModel