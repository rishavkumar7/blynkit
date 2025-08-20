import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import { IoClose } from "react-icons/io5"
import Axios from "../utils/Axios.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import { setAddressDetails } from "../store/addressSlice.js"
import { updateUserAddressDetails } from "../store/userSlice.js"

const AddAddressSpace = ({ setAddresses, close }) => {
    const dispatch = useDispatch()
    const userAddressDetails = useSelector(state => state?.user?.address_details)
    const addresses = useSelector(state => state?.address?.addresses)
    const [ adding, setAdding ] = useState(false)
    const [ addressData, setAddressData ] = useState({
        address_line : "",
        city : "",
        state : "",
        country : "",
        pincode : "",
        contact : "",
        status : true
    })

    const handleAddressDetailsChange = (e) => {
        const { name, value } = e?.target

        setAddressData(prev => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const isSubmitAllowed = () => {
        return (addressData?.address_line && addressData?.city && addressData?.state && addressData?.country && addressData?.pincode && addressData?.contact)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setAdding(true)

            const response = await Axios({
                ...SummaryApi?.add_address,
                data : {
                    address_line : addressData?.address_line,
                    city : addressData?.city,
                    state : addressData?.state,
                    country : addressData?.country,
                    pincode : addressData?.pincode,
                    contact : addressData?.contact,
                    status : addressData?.status
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                const newAddresses = [ responseData?.data, ...addresses ]
                setAddresses(newAddresses)
                dispatch(setAddressDetails(newAddresses))
                const newUserAddressDetails = [ responseData?.data?._id, ...userAddressDetails ]
                dispatch(updateUserAddressDetails(newUserAddressDetails))
                toast.success(responseData?.message)
                close()
            }
        } catch(error) {
            AxiosToastError(error)
        } finally {
            setAdding(false)
        }
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-200" >
            <div className="bg-slate-200 max-w-3xl w-full max-h-[70%] rounded-xl m-4 px-10 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden" >
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-neutral-800">Add New Address</h2>
                    <button onClick={ close } className="w-fit block ml-auto cursor-pointer" >
                        <IoClose size={ 25 } className="text-neutral-700" />
                    </button>
                </div>
                <form onSubmit={ handleSubmit } className="my-5 grid gap-4">
                    <div className="grid gap-1">
                        <label htmlFor="address_line">Address</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="address_line" name="address_line" value={ addressData?.address_line } autoFocus required placeholder="Enter your address" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="city">City</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="city" name="city" value={ addressData?.city } required placeholder="Enter your city" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="state">State</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="state" name="state" value={ addressData?.state } required placeholder="Enter your state" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="country">Country</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="country" name="country" value={ addressData?.country } required placeholder="Enter your country" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="pincode">Pincode</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="pincode" name="pincode" value={ addressData?.pincode } required placeholder="Enter your pincode" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="contact">Contact</label>
                        <input onChange={ handleAddressDetailsChange } type="number" id="contact" name="contact" value={ addressData?.contact } required placeholder="Enter your contact" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <button disabled={ !isSubmitAllowed() } className={ `${ isSubmitAllowed() ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-gray-500" } text-white mt-4 p-2 font-semibold tracking-wider rounded ${ isSubmitAllowed() ? "cursor-pointer" : "cursor-default" }` } >
                        {
                            adding ? (
                                "Adding ..."
                            ) : (
                                "Add Address"
                            )
                        }
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddAddressSpace