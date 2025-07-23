import { createSlice } from "@reduxjs/toolkit"

const initialValue = {
    cartItems : []
}

const cartSlice = createSlice({
    name : "cart",
    initialState : initialValue,
    reducers : {
        addItemToCart : (state, action) => {
            state.cartItems.unshift(action?.payload)
        },
        setCartItemsDetails : (state, action) => {
            state.cartItems = [ ...action?.payload ]
        },
        updateCartItemQuantity : (state, action) => {
            state.cartItems.forEach(item => {
                if (item?.product?._id === action?.payload?.productId) {
                    item.quantity = action?.payload?.quantity
                }
            })
        },
        removeItemFromCart : (state, action) => {
            const index = state.cartItems.findIndex(item => item?.product?._id === action?.payload)
            if (index != -1) {
                state.cartItems.splice(index, 1)
            }
        }
    }
})

export const { addItemToCart, setCartItemsDetails, updateCartItemQuantity, removeItemFromCart } = cartSlice.actions
export default cartSlice.reducer