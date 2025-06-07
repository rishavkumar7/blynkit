import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    categories : [],
    subcategories : [],
    listedSubcategories : [],
    products : []
}

const productSlice = createSlice({
    name : "product",
    initialState : initialValue,
    reducers : {
        setCategoryDetails : (state, action) => {
            state.categories = [ ...action.payload ]
        },
        setSubcategoryDetails : (state, action) => {
            state.subcategories = [ ...action.payload ]
        }
    }
})

export const { setCategoryDetails, setSubcategoryDetails } = productSlice.actions
export default productSlice.reducer