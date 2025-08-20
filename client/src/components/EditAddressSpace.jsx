import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IoClose } from "react-icons/io5"
import toast from "react-hot-toast"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import Axios from "../utils/Axios.jsx"
import { setAddressDetails } from "../store/addressSlice.js"

const EditAddressSpace = ({ setAddresses, currentAddress, close }) => {
    const dispatch = useDispatch()
    const addresses = useSelector(state => state?.address?.addresses)
    const [ updating, setUpdating ] = useState(false)
    const [ data, setData ] = useState({
        _id : currentAddress?._id,
        address_line : currentAddress?.address_line,
        city : currentAddress?.city,
        state : currentAddress?.state,
        country : currentAddress?.country,
        pincode : currentAddress?.pincode,
        contact : currentAddress?.contact,
        status : currentAddress?.status
    })

    const handleButtonColor = Object.keys(data).every(key => data[key] == currentAddress[key])

    const handleAddressDetailsChange = (e) => {
        const { name, value } = e?.target

        setData(prev => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const isSubmitAllowed = () => {
        return (data?.address_line && data?.city && data?.state && data?.country && data?.pincode && data?.contact)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setUpdating(true)
            const response = await Axios({
                ...SummaryApi.update_address,
                data : {
                    _id : data?._id,
                    address_line : data?.address_line,
                    city : data?.city,
                    state : data?.state,
                    country : data?.country,
                    pincode : data?.pincode,
                    contact : data?.contact,
                    status : data?.status
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                const editIndex = addresses.findIndex(address => address?._id === currentAddress?._id)
                const newAddresses = [ ...addresses ]
                newAddresses[editIndex] = {
                    ...data,
                    createdAt : currentAddress?.createdAt,
                    updatedAt : new Date().toISOString()
                }
                setAddresses(newAddresses)
                dispatch(setAddressDetails(newAddresses))
                toast.success(responseData?.message)
                close()
            }
        } catch(error) {
            AxiosToastError(error)
        } finally {
            setUpdating(false)
        }
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-200" >
            <div className="bg-slate-200 max-w-3xl w-full max-h-[70%] rounded-xl m-4 px-10 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden" >
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-neutral-800">Update Address</h2>
                    <button onClick={ close } className="w-fit block ml-auto cursor-pointer" >
                        <IoClose size={ 25 } className="text-neutral-700" />
                    </button>
                </div>
                <form onSubmit={ handleSubmit } className="my-5 grid gap-4">
                    <div className="grid gap-1">
                        <label htmlFor="address_line">Address</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="address_line" name="address_line" value={ data?.address_line } required placeholder="Enter your address" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="city">City</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="city" name="city" value={ data?.city } required placeholder="Enter your city" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="state">State</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="state" name="state" value={ data?.state } required placeholder="Enter your state" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="country">Country</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="country" name="country" value={ data?.country } required placeholder="Enter your country" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="pincode">Pincode</label>
                        <input onChange={ handleAddressDetailsChange } type="text" id="pincode" name="pincode" value={ data?.pincode } required placeholder="Enter your pincode" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="contact">Contact</label>
                        <input onChange={ handleAddressDetailsChange } type="number" id="contact" name="contact" value={ data?.contact } required placeholder="Enter your contact" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <button disabled={ !isSubmitAllowed() || handleButtonColor } className={ `${ !isSubmitAllowed() || handleButtonColor ? "bg-gray-500" : "bg-green-700 hover:bg-green-600 active:bg-green-500" } text-white mt-4 p-2 font-semibold tracking-wider rounded ${ !isSubmitAllowed() || handleButtonColor ? "cursor-default" : "cursor-pointer" }` } >
                        {
                            updating ? (
                                "Updating ..."
                            ) : (
                                "Update Address"
                            )
                        }
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditAddressSpace