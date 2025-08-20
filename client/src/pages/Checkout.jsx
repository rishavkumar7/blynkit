import { useState } from "react"
import { useSelector } from "react-redux"
import { TiTickOutline } from "react-icons/ti"
import AddressCard from "../components/AddressCard"
import NoData from "../components/NoData"

const Checkout = () => {
    const addresses = useSelector(state => state?.address?.addresses)
    const [ selectedAddress, setSelectedAddress ] = useState(null)

    const handleAddressbuttonClick = (addressId) => {
        setSelectedAddress(addressId)
    }

    return (
        <section className="w-full h-[80vh] lg:h-none container mx-auto sm:px-4 py-2 lg:px-8 lg:py-4 grid gap-2 grid-rows-3 lg:grid-cols-3" >
            <div className="row-span-2 lg:col-span-2 w-full py-2 flex flex-col gap-2 sm:gap-6 lg:h-[77vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-400 [&::-webkit-scrollbar-track]:bg-transparent" >
                <div className="w-full px-4 text-lg sm:text-2xl font-bold text-neutral-600 tracking-wide" >
                    Pick Address
                </div>
                {
                    addresses.length > 0 ? (
                        addresses.map((address, index) => {
                            return (
                                <div onClick={ () => { handleAddressbuttonClick(address?._id) } } key={ index } className={ `relative group h-47 sm:h-52 mx-2 px-1.5 py-1.5 sm:px-2 sm:py-2 flex items-center border-3 border-transparent ${ selectedAddress === address?._id ? "hover:border-green-600" : "hover:border-neutral-500" } rounded-lg cursor-pointer` } >
                                    <AddressCard address={ address } />
                                    <div className="absolute top-0 right-0 w-35 sm:w-40 h-8 sm:h-10 hidden group-hover:flex items-center justify-center rounded-bl-lg" >
                                        {
                                            selectedAddress === address?._id ? (
                                                <div className="w-full h-full flex items-center justify-center gap-2 rounded-bl-lg text-white text-md sm:text-xl font-bold bg-green-600 opacity-80" >
                                                    Selected
                                                    <TiTickOutline className="text-2xl sm:text-4xl" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center rounded-bl-lg text-white text-md sm:text-xl tracking-wider bg-neutral-500 opacity-80" >
                                                    Select
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className={ `absolute top-0 right-0 w-15.5 h-8 sm:h-10 ${ selectedAddress === address?._id ? "flex" : "hidden" } items-center justify-center group-hover:hidden bg-green-600 opacity-80 rounded-lg border-2 border-neutral-600` } >
                                        <TiTickOutline className="text-2xl sm:text-4xl text-white" />
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div>
                            <NoData />
                        </div>
                    )
                }
            </div>
            <div className="row-span-1 lg:col-span-1 w-full lg:h-[77vh] py-2 border-t-1 lg:border-t-0 lg:border-l-1 border-neutral-400 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-400 [&::-webkit-scrollbar-track]:bg-transparent" >
                <div className="w-full px-4 text-lg sm:text-2xl font-bold text-neutral-600 tracking-wide" >
                    Payment Options
                </div>
            </div>
        </section>
    )
}

export default Checkout