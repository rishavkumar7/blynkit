import { IoClose } from "react-icons/io5"
import { useCart } from "../utils/GlobalCartProvider.jsx"

const CartBill = ({ close }) => {
    const cartContext = useCart()
    const cartData = cartContext?.cartData

    const calculatePrice = (cartItem) => {
        return (cartItem?.product?.price * ((100.00 - cartItem?.product?.discount)/100) * cartItem?.quantity).toFixed(2)
    }

    const calculateTotal = () => {
        let totalQuantity = 0, totalPrice = 0.0

        cartData.forEach(cartItem => {
            totalQuantity += cartItem?.quantity
            totalPrice += parseFloat(calculatePrice(cartItem))
        })

        return {
            quantity : totalQuantity,
            price : totalPrice.toFixed(2)
        }
    }

    return (
        <section className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)]" >
            <div className="w-full sm:max-w-2xl max-h-[80vh] m-4 p-4 sm:p-6 bg-slate-200 rounded-lg overflow-y-auto [&::-webkit-scrollbar]:hidden" >
                <div className="mb-4 flex items-center justify-between" >
                    <p className="text-sm sm:text-xl text-neutral-700 font-bold" >Cart Bill</p>
                    <IoClose onClick={ close } className="text-2xl sm:text-3xl text-neutral-600 cursor-pointer" />
                </div>
                <div className="px-2 grid grid-cols-12 text-xs sm:text-lg text-neutral-700 font-semibold border-2 border-neutral-400" >
                    <div className="col-span-7 flex items-center justify-start" >
                        Product
                    </div>
                    <div className="col-span-2 flex items-center justify-center border-x-2 border-neutral-400" >
                        Qty
                    </div>
                    <div className="col-span-3 flex items-center justify-end" >
                        Amount
                    </div>
                </div>
                <div className="border-x-2 border-neutral-400" >
                    {
                        cartData.map((cartItem, index ) => {
                            return (
                                <div key={ index } className="px-2 grid grid-cols-12 text-xs sm:text-sm border-b-1 border-neutral-400" >
                                    <div className="py-0.5 col-span-7 flex items-center justify-start" >
                                        <p className="line-clamp-2 text-ellipsis overflow-hidden">
                                            { cartItem?.product?.name }
                                        </p>
                                    </div>
                                    <div className="py-0.5 col-span-2 flex items-center justify-center border-x-2 border-neutral-400" >
                                        { cartItem?.quantity }
                                    </div>
                                    <div className="py-0.5 col-span-3 flex items-center justify-end" >
                                        { calculatePrice(cartItem) }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="px-2 grid grid-cols-12 text-sm sm:text-lg text-neutral-700 font-bold border-2 border-neutral-400" >
                    <div className="py-1 col-span-7 flex items-center justify-start" >
                        Sub-Total
                    </div>
                    <div className="py-1 col-span-2 flex items-center justify-center border-x-2 border-neutral-400" >
                        { calculateTotal()?.quantity }
                    </div>
                    <div className="py-1 col-span-3 flex items-center justify-end" >
                        { calculateTotal()?.price }
                    </div>
                </div>
                <div className="mt-4" >
                    <div className="pb-0.5 text-xs sm:text-lg text-neutral-700 font-semibold" >
                        Extra Charges
                    </div>
                    <div className="text-xs sm:text-sm border-x-2 border-t-2 border-neutral-400" >
                        <div className="px-1 grid grid-cols-12 border-b-2 border-neutral-400" >
                            <div className="py-0.5 col-span-9 flex items-center justify-start border-r-2 border-neutral-400" >
                                Service Charge
                            </div>
                            <div className="py-0.5 col-span-3 flex items-center justify-end" >
                                0.00
                            </div>
                        </div>
                        <div className="px-1 grid grid-cols-12 border-b-2 border-neutral-400" >
                            <div className="py-0.5 col-span-9 flex items-center justify-start border-r-2 border-neutral-400" >
                                Service Tax
                            </div>
                            <div className="py-0.5 col-span-3 flex items-center justify-end" >
                                0.00
                            </div>
                        </div>
                        <div className="px-1 grid grid-cols-12 border-b-2 border-neutral-400" >
                            <div className="py-0.5 col-span-9 flex items-center justify-start border-r-2 border-neutral-400" >
                                Delivery Charge
                            </div>
                            <div className="py-0.5 col-span-3 flex items-center justify-end" >
                                0.00
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 py-1 flex items-center justify-between text-lg sm:text-2xl text-neutral-700 font-extrabold tracking-wider border-y-2 border-dashed" >
                    <div className="" >
                        Total
                    </div>
                    <div className="">
                        { calculateTotal()?.price }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartBill