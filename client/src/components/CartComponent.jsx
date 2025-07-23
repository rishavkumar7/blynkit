import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoClose } from "react-icons/io5"
import { FaExternalLinkAlt } from "react-icons/fa"
import { LiaRupeeSignSolid } from "react-icons/lia"
import { useCart } from "../utils/GlobalCartProvider.jsx"
import CartItemCard from "./CartItemCard.jsx"
import noCartItems from "../assets/empty-cart.png"
import CartBill from "./CartBill.jsx"

const CartComponent = () => {
    const navigate = useNavigate()
    const cartContext = useCart()
    const cartData = cartContext?.cartData
    const [ openBill, setOpenBill ] = useState(false)

    const handleCloseShoppingCartButtonClick = () => {
        cartContext?.setOpenCart(false)
    }

    const handleShopNowButtonClick = () => {
        cartContext?.setOpenCart(false)
        navigate("/")
    }

    const calculateTotalAmountWithoutDiscount = () => {
        let totalAmount = 0.0

        cartData.forEach(cartItem => {
            totalAmount += (cartItem?.product?.price * cartItem?.quantity)
        })

        return totalAmount.toFixed(2)
    }

    const calculateTotalSavings = () => {
        let totalSavings = 0.0

        cartData.forEach(cartItem => {
            totalSavings += (cartItem?.product?.price * (cartItem?.product?.discount/100) * cartItem?.quantity)
        })

        return totalSavings.toFixed(2)
    }

    const handleViewBillButtonClick = () => {
        setOpenBill(true)
    }

    const handleCloseBillViewButtonClick = () => {
        setOpenBill(false)
    }

    const handleProceedButtonClick = () => {

    }

    return (
        <section className="w-full h-full absolute inset-0 flex items-center justify-end bg-[rgba(0,0,0,0.6)]" >
            <div className="w-full h-full p-4 max-w-100 bg-[rgba(0,0,0,0.7)] text-white" >
                <div className="flex items-center justify-between" >
                    <div className="text-xl font-bold tracking-wider overflow-hidden whitespace-nowrap text-ellipsis cursor-default" >
                        Shopping Cart
                    </div>
                    <IoClose onClick={ handleCloseShoppingCartButtonClick } size={ 30 } className="cursor-pointer" />
                </div>
                <div className="h-0.5 mt-3 bg-neutral-500"></div>
                <div className="mt-4">
                    {
                        (cartData.length > 0) ? (
                            <div className="flex flex-col items-center">
                                <div className="w-fit px-4 py-1 mb-4 flex items-center justify-center gap-1 text-sm text-blue-400 border-1 border-blue-400 rounded-full">
                                    You are saving
                                    <div className="flex items-center font-bold tracking-wider">
                                        <LiaRupeeSignSolid size={ 16 } />
                                        { calculateTotalSavings() }
                                    </div>
                                </div>
                                <div className="h-[70vh] flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent">
                                    {
                                        cartData.map((cartItem, index) => {
                                            return (
                                                <div key={ index } >
                                                    <CartItemCard cartItem={ cartItem } />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="mt-0.5 w-full">
                                    <div className="h-0.5 mt-3 bg-neutral-500"></div>
                                    <div className="mt-0.5 w-full flex items-center justify-between">
                                        <div className="text-lg font-bold tracking-wider">
                                            { `${ cartData?.length } ${ cartData?.length > 0 ? "Items" : "Item" }` }
                                        </div>
                                        <div className="flex items-center gap-1 text-lg font-bold tracking-wider">
                                            <LiaRupeeSignSolid size={ 20 } />
                                            { `${ (calculateTotalAmountWithoutDiscount() - calculateTotalSavings()).toFixed(2) }` }
                                        </div>
                                    </div>
                                    <div className="mt-0.5 flex items-center justify-between text-md font-medium tracking-wider">
                                        <div onClick={ handleViewBillButtonClick } className="px-2 py-0.5 border-2 hover:border-neutral-400 active:border-white rounded-lg hover:bg-neutral-400 active:bg-white hover:text-neutral-900 cursor-pointer select-none" >
                                            View Bill
                                        </div>
                                        <div onClick={ handleProceedButtonClick } className="px-2 py-0.5 border-2 hover:border-neutral-400 active:border-white rounded-lg hover:bg-neutral-400 active:bg-white hover:text-neutral-900 cursor-pointer select-none" >
                                            Proceed
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center gap-5" >
                                <div className="w-full h-full flex items-center justify-center" >
                                    <img src={ noCartItems } alt="no items" className="max-w-sm max-h-sm" />
                                </div>
                                <p className="flex items-center justify-center tracking-wider font-semibold text-xl text-neutral-400 cursor-default" >
                                    Cart&nbsp;&nbsp;is&nbsp;&nbsp;empty
                                </p>
                                <button onClick={ handleShopNowButtonClick } className="w-fit px-2 py-1 flex items-center justify-center gap-2 font-bold tracking-wider border-2 border-neutral-300 text-neutral-300 hover:bg-neutral-300 hover:text-neutral-900 rounded-lg cursor-pointer" >
                                    Shop Now
                                    <FaExternalLinkAlt />
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            {
                openBill && (
                    <div className="absolute top-0 bottom-0 left-0 right-0" >
                        <CartBill close={ handleCloseBillViewButtonClick } />
                    </div>
                )
            }
        </section>
    )
}

export default CartComponent