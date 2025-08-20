import { FaHouse, FaPhone } from "react-icons/fa6"
import { TiEdit } from "react-icons/ti"
import { RiDeleteBin6Line } from "react-icons/ri"

const AddressCard = ({ address, editAddress, deleteAddress }) => {
    const handleAddressDeleteButtonClick = () => {
        deleteAddress(address)
    }

    const handleAddressEditButtonClick = () => {
        editAddress(address)
    }

    return (
        <div className="w-full h-full container px-4 py-2 sm:px-8 sm:py-4 group flex gap-2 shadow-[0_0_10px_1px_rgba(0,0,0,0.2)] bg-slate-400 rounded-lg" >
            <div className="w-full h-full flex flex-col items-start justify-center gap-2 ">
                <div className="w-full h-full flex items-center" >
                    <div className="h-full px-2 sm:px-3 flex items-center justify-center rounded-l-lg bg-neutral-200" >
                        <FaHouse className="text-2xl sm:text-4xl text-slate-500" />
                    </div>
                    <div className="w-full h-full px-2 sm:px-4 py-2 rounded-r-lg bg-neutral-200 border-l-3 border-black/15" >
                        <div className="w-full text-sm sm:text-lg text-neutral-700 font-medium tracking-wide overflow-x-hidden line-clamp-2 sm:line-clamp-1 text-ellipsis" >
                            { address?.address_line }
                        </div>
                        <div className="w-full text-sm sm:text-lg text-neutral-700 font-medium tracking-wide overflow-x-hidden line-clamp-1 text-ellipsis" >
                            { `${ address?.city } - ${ address?.pincode }` }
                        </div>
                        <div className="w-full text-xs sm:text-sm text-neutral-500 font-medium tracking-wide overflow-x-hidden line-clamp-1 text-ellipsis" >
                            { `${ address?.state } - ${ address?.country }` }
                        </div>
                    </div>
                </div>
                <div className="w-full flex" >
                    <div className="px-3 sm:px-4.5 flex items-center justify-center rounded-l-lg bg-neutral-200" >
                        <FaPhone className="text-md sm:text-2xl text-slate-500" />
                    </div>
                    <div className="px-4 py-2 text-md sm:text-xl font-extrabold sm:font-bold tracking-widest text-neutral-500 rounded-r-lg bg-neutral-200 border-l-3 border-black/15 overflow-x-hidden line-clamp-1 text-ellipsis" >
                        { address?.contact }
                    </div>
                </div>
            </div>
            {
                (editAddress || deleteAddress) && (
                    <div className="w-8 sm:w-10 hidden group-hover:flex flex-col items-center gap-2" >
                        {
                            deleteAddress && (
                                <div onClick={ handleAddressDeleteButtonClick } className="p-1 sm:p-2 bg-neutral-200 rounded-md cursor-pointer" >
                                    <RiDeleteBin6Line className="text-xl sm:text-2xl text-slate-700" />
                                </div>
                            )
                        }
                        {
                            editAddress && (
                                <div onClick={ handleAddressEditButtonClick } className="p-1 sm:p-2 bg-neutral-200 rounded-md cursor-pointer" >
                                    <TiEdit className="text-xl sm:text-2xl text-slate-700" />
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default AddressCard