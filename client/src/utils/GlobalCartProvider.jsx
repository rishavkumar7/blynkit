import { createContext, useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import Axios from "./Axios.jsx"
import AxiosToastError from "./AxiosToastError.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import { updateUserShoppingCart } from "../store/userSlice.js"
import { addItemToCart, updateCartItemQuantity, removeItemFromCart } from "../store/cartSlice.js"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const dispatch = useDispatch()
    const userShoppingCart = useSelector(state => state?.user?.shopping_cart)
    const cartData = useSelector(state => state?.cart?.cartItems)
    const [ openCart, setOpenCart ] = useState(false)

    const addItemToShoppingCart = async (product) => {
        try {
            const response = await Axios({
                ...SummaryApi.add_item_to_cart,
                data : {
                    product_id : product?._id
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                const newCartItem = {
                    cart_item_id : responseData?.data?._id,
                    product : product,
                    quantity : responseData?.data?.quantity,
                    createdAt : responseData?.data?.createdAt,
                    updatedAt : responseData?.data?.updatedAt
                }
                dispatch(addItemToCart(newCartItem))
                const newUserShoppingCart = [ responseData?.data?._id, ...userShoppingCart ]
                dispatch(updateUserShoppingCart(newUserShoppingCart))
                toast.success(responseData?.message)
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    const updateItemQuantityInShoppingCart = async (productId, quantity) => {
        try {
            const response = await Axios({
                ...SummaryApi.update_cart_item_quantity,
                data : {
                    product_id : productId,
                    quantity : quantity
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                dispatch(updateCartItemQuantity({ productId, quantity }))
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    const removeItemFromShoppingCart = async (productId, cartItemId) => {
        try {
            const response = await Axios({
                ...SummaryApi.delete_item_from_cart,
                data : {
                    product_id : productId
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                dispatch(removeItemFromCart(productId))
                const newUserShoppingCart = userShoppingCart.filter(userCartItemId => userCartItemId !== cartItemId)
                dispatch(updateUserShoppingCart(newUserShoppingCart))
                toast.success("Item has been removed from the cart successfully !!")
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <CartContext.Provider value={{ cartData, openCart, setOpenCart, addItemToShoppingCart, updateItemQuantityInShoppingCart, removeItemFromShoppingCart }} >
            { children }
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)