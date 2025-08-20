import toast from "react-hot-toast"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FaPlus, FaMinus } from "react-icons/fa"
import { LiaRupeeSignSolid } from "react-icons/lia"
import calculateDiscounterPrice from "../utils/calculateDiscountedPrice.js"
import { useCart } from "../utils/GlobalCartProvider.jsx"

const CartItemCard = ({ cartItem }) => {
    const cartContext = useCart()

    const priceAdjuster = (price) => {
        return price < 1000 ? price.toFixed(2) : (price < 1000000 ? Math.round(price) : `${ Math.round(price/1000) }k` )
    }

    const handleDeleteCartItemButtonClick = () => {
        cartContext?.removeItemFromShoppingCart(cartItem?.product?._id, cartItem?.cart_item_id)
    }

    const handleDecreaseCartItemQuantityButtonClick = () => {
        if (cartItem?.quantity <= 0) {
            toast.error("Quantity cannot be negative")
            return
        }
        if (cartItem?.quantity === 1) {
            cartContext?.removeItemFromShoppingCart(cartItem?.product?._id, cartItem?.cart_item_id)
        } else {
            cartContext?.updateItemQuantityInShoppingCart(cartItem?.product?._id, cartItem?.quantity - 1)
        }
    }

    const handleIncreaseCartItemQuantityButtonClick = () => {
        if (cartItem?.quantity >= cartItem?.product?.stock) {
            toast.error("Product quantity cannot exceed the stock limit.")
            return
        }
        cartContext?.updateItemQuantityInShoppingCart(cartItem?.product?._id, cartItem?.quantity + 1)
    }

    return (
        <div className="grid grid-cols-5 bg-[rgba(82,82,82,0.4)] rounded overflow-hidden" >
            <div className="col-span-1 flex items-center overflow-hidden">
                <img src={ cartItem?.product?.image[0] } alt="cart-item-image" className="w-full h-full object-cover object-center rounded" />
            </div>
            <div className="px-2 py-1 col-span-4 grid grid-rows-5" >
                <div className="w-full row-span-3 grid grid-cols-6" >
                    <div className="col-span-5 grid grid-rows-2" >
                        <div className="row-span-1 text-sm overflow-hidden whitespace-nowrap text-ellipsis" >
                            { cartItem?.product?.name }
                        </div>
                        <div className="row-span-1 grid grid-cols-2 text-xs text-white/60 font-light">
                            <div className="col-span-1 flex overflow-hidden whitespace-nowrap text-ellipsis" >
                                <LiaRupeeSignSolid size={ 15 } />
                                { `${ cartItem?.product?.price.toFixed(2) }` }
                            </div>
                            <div className="col-span-1 flex justify-start overflow-hidden whitespace-nowrap text-ellipsis" >
                                { `${ cartItem?.product?.unit } unit` }
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex items-begin justify-end" >
                        <RiDeleteBin6Line onClick={ handleDeleteCartItemButtonClick } size={ 18 } className="text-neutral-500 hover:text-neutral-300 active:text-white cursor-pointer" />
                    </div>
                </div>
                <div className="row-span-2 grid grid-cols-4">
                    <div className="col-span-2 flex items-center justify-start text-md tracking-wider font-bold" >
                        <LiaRupeeSignSolid size={ 20 } />
                        { priceAdjuster(calculateDiscounterPrice(cartItem?.product?.price * cartItem?.quantity, cartItem?.product?.discount)) }
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                        <div className="p-1 flex items-center rounded border-1 border-neutral-500">
                            <button onClick={ handleDecreaseCartItemQuantityButtonClick } className="px-2 py-1 rounded bg-green-700 hover:bg-green-600 active:bg-green-500 text-white cursor-pointer">
                                <FaMinus size={ 8 } />
                            </button>
                            <div className="min-w-8 flex items-center justify-center font-bold text-xs tracking-wider text-white cursor-default">
                                { cartItem?.quantity }
                            </div>
                            <button onClick={ handleIncreaseCartItemQuantityButtonClick } className="px-2 py-1 rounded bg-green-700 hover:bg-green-600 active:bg-green-500 text-white cursor-pointer">
                                <FaPlus size={ 8 } />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItemCard