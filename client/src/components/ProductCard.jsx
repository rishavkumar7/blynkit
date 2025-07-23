import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { TiEdit } from "react-icons/ti"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FaRupeeSign, FaPlus, FaMinus } from "react-icons/fa"
import { useCart } from "../utils/GlobalCartProvider.jsx"

const ProductCard = ({ openProductSpace, openEditSpace, openConfirmBox, product }) => {
    const cartContext = useCart()
    const cartData = cartContext?.cartData
    const [ cartItemData, setCartItemData ] = useState({
        cart_item_id : "",
        product_id : "",
        quantity : 0
    })

    const updateCartItemData = () => {
        const cartItemInfo = [ ...cartData ].find(item => item?.product?._id === product?._id) || {}
        setCartItemData({
            cart_item_id : cartItemInfo?.cart_item_id,
            product_id : cartItemInfo?.product?._id,
            quantity : Number(cartItemInfo?.quantity) || 0
        })
    }

    useEffect(() => {
        updateCartItemData()
    }, [ cartData ])

    const handleOpenProductClick = () => {
        openProductSpace(product)
    }

    const handleEditProductButtonClick = () => {
        openEditSpace(product)
    }

    const handleDeleteProductButtonClick = () => {
        openConfirmBox(product)
    }

    const handleAddProductButtonClick = () => {
        if (cartItemData && cartItemData?.quantity !== 0) {
            toast.error("Item is already included in the cart. You are only allowed to change its quantity.")
            return
        }
        cartContext?.addItemToShoppingCart(product)
    }

    const handleDecreaseCartItemQuantityButtonClick = () => {
        if (cartItemData?.quantity <= 0) {
            toast.error("Quantity cannot be negative")
            return
        }
        if (cartItemData?.quantity === 1) {
            cartContext?.removeItemFromShoppingCart(product?._id)
        } else {
            cartContext?.updateItemQuantityInShoppingCart(product?._id, cartItemData?.quantity - 1)
        }
        setCartItemData(prev => {
            return {
                ...prev,
                quantity : prev?.quantity - 1
            }
        })
    }

    const handleIncreaseCartItemQuantityButtonClick = () => {
        if (cartItemData?.quantity >= product?.stock) {
            toast.error("Product quantity cannot exceed the stock limit.")
            return
        }
        cartContext?.updateItemQuantityInShoppingCart(product?._id, cartItemData?.quantity + 1)
        setCartItemData(prev => {
            return {
                ...prev,
                quantity : prev?.quantity + 1
            }
        })
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center shadow-[0_0_10px_1px_rgba(0,0,0,0.2)] bg-white rounded-lg">
            <div onClick={ openProductSpace ? handleOpenProductClick : null } className={ `relative group w-full flex items-start justify-center ${ openProductSpace ? "aspect-[0.85]" : "aspect-[0.9] sm:aspect-[1.0] md:aspect-[1.1] lg:aspect-[1.3]" } overflow-hidden rounded-lg ${ openProductSpace ? "cursor-pointer" : "cursor-default" }` } >
                <img src={ product?.image[0] } alt={ product?.name } className="rounded-lg scale-115 sm:scale-105 object-cover object-[center_5px] sm:object-[center_0] lg:-translate-y-4"/>
                <div className={ `w-[55%] h-[90%] absolute top-0 right-0 ${ (openEditSpace || openConfirmBox) ? "block" : "hidden" } group-hover:bg-[linear-gradient(250deg,_rgba(0,0,0,1)_25%,_transparent_60%)] lg:group-hover:bg-[linear-gradient(232deg,_rgba(0,0,0,1)_20%,_transparent_50%)]` } ></div>
                <div className="absolute top-1 right-2 hidden group-hover:flex flex-col items-center justify-center gap-2 z-1">
                    <button onClick={ handleDeleteProductButtonClick } className={ `${ openConfirmBox ? "block" : "hidden" } text-white bg-transparent cursor-pointer` } ><RiDeleteBin6Line size={ 30 } /></button>
                    <button onClick={ handleEditProductButtonClick } className={ `${ openEditSpace ? "block" : "hidden" } text-white bg-transparent cursor-pointer` } ><TiEdit size={ 30 } /></button>
                </div>
                <div className={ `absolute inset-0 ${ openProductSpace ? "bg-[linear-gradient(to_top,_rgba(0,0,0,1)_8%,_transparent_100%)]" : "bg-[linear-gradient(to_top,_rgba(0,0,0,1)_8%,_transparent_70%)]" } p-1 flex items-end rounded-lg` } >
                    <div className="w-full px-1 flex flex-col items-start justify-center">
                        <div className="w-full font-semibold text-sm sm:text-md md:text-lg text-white flex items-center justify-start">
                            <p className="w-full line-clamp-2">{ product?.name }</p>
                        </div>
                        <div className="w-full flex items-center justify-between tracking-wider">
                            <p className="text-xs sm:text-sm text-white/70">{ product?.unit }</p>
                            <div className="flex justify-center gap-1 sm:gap-2">
                                <div className="flex items-center sm:gap-1 text-md sm:text-xl font-bold text-lime-300">
                                    <FaRupeeSign />
                                    <p>{ product?.price }</p>
                                </div>
                                <div className="flex items-center">
                                    {
                                        product?.discount > 0 && (
                                            <p className="text-red-300 flex items-center text-xs">-{ product?.discount }%</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            openProductSpace && (
                                <div className="w-full mt-1" >
                                    {
                                        product?.stock > 0 ? (
                                            <div className="flex items-center justify-end" >
                                                {
                                                    (cartItemData && cartItemData?.quantity !== 0) ? (
                                                        <div className="mb-1 p-[3px] flex items-center gap-3 border-1 border-neutral-400 rounded-lg">
                                                            <button onClick={ (e) => { e.stopPropagation(); handleDecreaseCartItemQuantityButtonClick() } } className="p-[3px] lg:p-1 rounded bg-green-700 hover:bg-green-600 active:bg-green-500 text-white cursor-pointer">
                                                                <FaMinus className="text-xs lg:text-sm" />
                                                            </button>
                                                            <div className="min-w-6 flex items-center justify-center font-semibold text-xs lg:text-sm text-white cursor-default">
                                                                { cartItemData?.quantity }
                                                            </div>
                                                            <button onClick={ (e) => { e.stopPropagation(); handleIncreaseCartItemQuantityButtonClick() } } className="p-[3px] lg:p-1 rounded bg-green-700 hover:bg-green-600 active:bg-green-500 text-white cursor-pointer">
                                                                <FaPlus className="text-xs lg:text-sm" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="mb-1 p-[3px] flex items-center border-1 border-neutral-400 rounded-lg">
                                                            <button onClick={ (e) => { e.stopPropagation(); handleAddProductButtonClick() } } className="min-w-21 lg:min-w-23 p-[1px] px-3 bg-green-700 hover:bg-green-600 active:bg-green-500 font-semibold tracking-wider text-xs lg:text-sm text-white rounded cursor-pointer">
                                                                Add
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <div className="mb-1 flex items-center justify-end text-red-400 text-sm lg:text-lg font-semibold whitespace-nowrap">
                                                { `Out of Stock` }
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard