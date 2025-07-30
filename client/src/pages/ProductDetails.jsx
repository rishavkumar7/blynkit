import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { FaRupeeSign, FaExpandArrowsAlt, FaPlus, FaMinus } from "react-icons/fa"
import calculateDiscountedPrice from "../utils/calculateDiscountedPrice.js"
import bestPricesOffersImage from "../assets/best-prices-offers.png"
import fastDeliveryImage from "../assets/minute-delivery.png"
import wideAssortmentImage from "../assets/wide-assortment.png"
import { useCart } from "../utils/GlobalCartProvider.jsx"

const ProductDetails = () => {
    const location = useLocation()
    const user = useSelector(state => state?.user)
    const cartContext = useCart()
    const cartData = cartContext?.cartData
    const [ cartItemData, setCartItemData ] = useState({
        cart_item_id : "",
        product_id : "",
        quantity : 0
    })
    const [ product, setProduct ] = useState(location?.state?.product)
    const [ currentImageIndex, setCurrentImageIndex ] = useState(0)

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

    const handleSmallImageClick = (index) => {
        setCurrentImageIndex(index)
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
        <section className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full container m-2 lg:m-4 grid sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-2 lg:gap-4">
                <div className="w-full h-full flex sm:flex-col items-center justify-center sm:col-span-2 gap-2 lg:gap-6">
                    <div className="w-full h-full max-h-80 sm:max-h-fit flex items-center justify-center bg-white border border-neutral-300">
                        <img src={ product?.image[currentImageIndex] } alt={ `image ${ currentImageIndex + 1 }` } className="w-fit max-h-full sm:max-h-[60vh] object-cover" />
                    </div>
                    <div className="max-w-full max-h-80 flex flex-col sm:flex-row items-center justify-center-safe gap-2 overflow-y-auto sm:overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        <div className="w-fit h-fit flex flex-col sm:flex-row items-center justify-center-safe gap-2">
                            {
                                product?.image.map((img, index) => {
                                    return (
                                        <div onClick={ () => { handleSmallImageClick(index) } } key={ index } className={ `relative border ${ index !== currentImageIndex ? "border-neutral-400 cursor-pointer" : "pointer-events-none" } select-none` } >
                                            <img src={ img } alt={ `image ${ currentImageIndex + 1 }` } className="w-fit max-h-12 sm:max-w-16 sm:max-h-16 lg:max-w-20 lg:max-h-20 sm:h-fit object-cover" />
                                            <div className={ `absolute inset-0 flex items-center justify-center ${ index === currentImageIndex ? "bg-black/60" : "" }` }>
                                                {
                                                    (index === currentImageIndex) && (
                                                        <FaExpandArrowsAlt className="text-white/80 text-xl sm:text-2xl lg:text-3xl" />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="sm:h-[77vh] py-2 sm:px-2 lg:px-6 sm:col-span-2 lg:col-span-3 border-t-2 sm:border-t-0 sm:border-l-2 border-neutral-200 sm:overflow-y-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-track]:bg-black/10">
                    <div className="p-2 pl-3 sm:p-2 sm:pl-4 font-bold text-lg sm:text-2xl text-neutral-700 rounded-l-xl bg-[linear-gradient(to_right,_rgba(0,0,0,0.15)_1%,_transparent_60%)]">
                        { product?.name }
                    </div>
                    <div className="my-2 border-1 border-neutral-200" ></div>
                    <div className="my-1 lg:my-2 px-1 flex gap-1">
                        <div className="px-2 py-1 lg:px-4 w-fit flex items-center justify-center rounded-full text-xs lg:text-sm font-semibold text-white bg-neutral-400 border">
                            { `${ product?.unit } Unit` }
                        </div>
                        {
                            product?.discount > 0 && (
                                <div className="px-2 py-1 lg:px-4 w-fit flex items-center justify-center rounded-full text-xs lg:text-sm font-bold tracking-widest text-white bg-green-700 border">
                                    { `${ product?.discount }% off` }
                                </div>
                            )
                        }
                    </div>
                    <div className="p-4 flex items-center gap-1 font-bold text-2xl lg:text-3xl text-neutral-700" >
                        <FaRupeeSign />
                        { calculateDiscountedPrice(product?.price, product?.discount).toFixed(2) }
                        {
                            product?.discount > 0 && (
                                <span className="flex items-center text-[1.0rem] lg:text-[1.2rem] font-semibold text-neutral-500 line-through pl-2">
                                    { product?.price.toFixed(2) }
                                </span>
                            )
                        }
                        <span className="ml-2 text-xs text-neutral-800 font-light">
                            { `(Inclusive of all taxes)` }
                        </span>
                    </div>
                    {
                        user?._id && (
                            <div className="pl-2 tracking-wider" >
                                {
                                    product?.stock > 0 ? (
                                        <div className="flex items-center gap-4 lg:gap-8">
                                            {
                                                (cartItemData && cartItemData?.quantity !== 0) ? (
                                                    <div className="mb-2 p-[3px] lg:p-[5px] flex items-center gap-3 lg:gap-4 border-2 border-neutral-200 rounded-lg">
                                                        <button onClick={ handleDecreaseCartItemQuantityButtonClick } className="p-2 rounded bg-green-700 hover:bg-green-600 active:bg-green-500 text-white cursor-pointer">
                                                            <FaMinus className="text-md lg:text-2xl" />
                                                        </button>
                                                        <div className="min-w-10 flex items-center justify-center font-bold text-2xl text-neutral-600 cursor-default">
                                                            { cartItemData?.quantity }
                                                        </div>
                                                        <button onClick={ handleIncreaseCartItemQuantityButtonClick } className="p-2 rounded bg-green-700 hover:bg-green-600 active:bg-green-500 text-white cursor-pointer">
                                                            <FaPlus className="text-md lg:text-2xl" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="mb-2 p-[3px] lg:p-[5px] flex items-center border-2 border-neutral-200 rounded-lg">
                                                        <button onClick={ handleAddProductButtonClick } className="min-w-32 lg:min-w-38 p-1.5 px-4 bg-green-700 hover:bg-green-600 active:bg-green-500 font-bold tracking-wider text-sm lg:text-lg text-nowrap text-white rounded cursor-pointer">
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            <div className="text-green-700 font-semibold  text-xs lg:text-sm">
                                                { `${ product?.stock <= 10 ? "Only " : "" } ${ product?.stock } item${ product?.stock > 1 ? "s" : "" } left in stock.` }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-red-600 font-bold text-lg lg:text-xl">
                                            { `Out of Stock` }
                                        </div>
                                    )
                                }
                            </div>
                        )
                    } 
                    <div className="mt-4 px-1 flex flex-col gap-1">
                        <div className="font-semibold tracking-wide text-md lg:text-lg text-neutral-600">Description</div>
                        <div className="p-2 lg:px-4 text-sm lg:text-[95%] text-neutral-600 bg-neutral-200 rounded-lg">
                            { product?.description }
                        </div>
                    </div>
                    <div className="mt-12 mb-4 px-1 flex flex-col gap-4">
                        <div className="font-semibold tracking-wide text-md lg:text-md text-neutral-800">
                            Why Shop from Blynkit ?
                        </div>
                        <div className="flex flex-col gap-3 lg:gap-2">
                            <div className="flex items-center gap-2">
                                <img src={ fastDeliveryImage } alt="fastDeliveryImage" className="w-15 lg:w-18" />
                                <div className="text-xs lg:text-sm">
                                    <div className="font-semibold">Superfast Delivery</div>
                                    <div className="font-light">Get your order delivered to your doorstep at the earliest from dark stores near you.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={ bestPricesOffersImage } alt="bestPricesImage" className="w-15 lg:w-18" />
                                <div className="text-xs lg:text-sm">
                                    <div className="font-semibold">Best Prices & Offers</div>
                                    <div className="font-light">Best price destination with offers directly from the manufacturers.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={ wideAssortmentImage } alt="wideAssortmentImage" className="w-15 lg:w-18" />
                                <div className="text-xs lg:text-sm">
                                    <div className="font-semibold">Wide Assortment</div>
                                    <div className="font-light">Choose from 500+ products across food, personal care, household & other categories.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails