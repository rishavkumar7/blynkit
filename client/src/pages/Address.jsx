import { use, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import AddAddressSpace from "../components/AddAddressSpace.jsx"
import AddressCard from "../components/AddressCard.jsx"
import EditAddressSpace from "../components/EditAddressSpace.jsx"
import ConfirmBox from "../components/ConfirmBox.jsx"
import Axios from "../utils/Axios.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import { setAddressDetails } from "../store/addressSlice.js"
import { updateUserAddressDetails } from "../store/userSlice.js"
import NoData from "../components/NoData.jsx"

const Address = () => {
    const dispatch = useDispatch()
    const userAddressDetails = useSelector(state => state?.user?.address_details)
    const addressesData = useSelector(state => state?.address?.addresses)
    const [ scrolled, setScrolled ] = useState(false)
    const [ addresses, setAddresses ] = useState([])
    const [ openAddAddressSpace, setOpenAddAddressSpace ] = useState(false)
    const [ currentEditingAddress, setcurrentEditingAddress ] = useState({
        _id : "",
        address_line : "",
        city : "",
        state : "",
        country : "",
        pincode : "",
        contact : "",
        status : true
    })
    const [ currentDeletingAddress, setcurrentDeletingAddress ] = useState({
        _id : ""
    })

    useEffect(() => {
        setAddresses(addressesData)
    }, [ addressesData ])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 35)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleAddAddressButtonClick = () => {
        setOpenAddAddressSpace(true)
    }

    const handleCloseAddAddressSpace = () => {
        setOpenAddAddressSpace(false)
    }

    const handleAddressEditButtonClick = (address) => {
        setcurrentEditingAddress({
            _id : address?._id,
            address_line : address?.address_line,
            city : address?.city,
            state : address?.state,
            country : address?.country,
            pincode : address?.pincode,
            contact : address?.contact,
            status : address?.status
        })
    }

    const handleCloseEditAddressSpace = () => {
        setcurrentEditingAddress({
            _id : "",
            address_line : "",
            city : "",
            state : "",
            country : "",
            pincode : "",
            contact : "",
            status : true
        })
    }

    const handleAddressDeleteButtonClick = (address) => {
        setcurrentDeletingAddress({
            _id : address?._id
        })
    }

    const handleConfirmDeleteButtonClick = async () => {
        try {
            const response = await Axios({
                ...SummaryApi?.delete_address,
                data : {
                    _id : currentDeletingAddress?._id
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                const deleteIndex = addressesData.findIndex(address => address?._id === currentDeletingAddress?._id)
                const newAddresses = [ ...addresses ]
                newAddresses.splice(deleteIndex, 1)
                setAddresses(newAddresses)
                dispatch(setAddressDetails(newAddresses))
                const newUserAddressDetails = userAddressDetails.filter(addressId => addressId !== currentDeletingAddress?._id)
                dispatch(updateUserAddressDetails(newUserAddressDetails))
                toast.success(responseData?.message)
                setcurrentDeletingAddress({
                    _id : ""
                })
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    const handleCloseConfirmBoxButtonClick = () => {
        setcurrentDeletingAddress({
            _id : ""
        })
    }

    return (
        <section className="w-full h-full" >
            <div className="relative h-14 px-4 flex items-center justify-between shadow-sm">
                <h2 className="text-xl text-neutral-600 font-bold tracking-wide">
                    My Address
                </h2>
                <button onClick={ handleAddAddressButtonClick } className={ `fixed right-[clamp(1rem,2vw,3rem)] z-50 px-2 py-1 font-semibold rounded bg-blue-800 hover:bg-blue-700 active:bg-blue-600 text-white cursor-pointer ${ scrolled && "shadow-[0_0_50px_30px_rgba(0,0,0,1)] bg-white/80 hover:bg-white/90 active:bg-white/100 text-yellow-950" }` } >
                    Add Address
                </button>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-6 grid gap-3 sm-gap-4 md:gap-5 lg:gap-6" >
                {
                    addresses.length === 0 ? (
                        <NoData message={ "No Address" } />
                    ) : (
                        addresses.map((address, index) => {
                            return (
                                <div key={ index } className="w-full h-full flex items-center justify-center rounded-lg" >
                                    <AddressCard address={ address } editAddress={ handleAddressEditButtonClick } deleteAddress={ handleAddressDeleteButtonClick } />
                                </div>
                            )
                        })
                    )
                }
            </div>
            {
                openAddAddressSpace && (
                    <AddAddressSpace setAddresses={ setAddresses } close={ handleCloseAddAddressSpace } />
                )
            }
            {
                currentEditingAddress?._id && (
                    <EditAddressSpace setAddresses={ setAddresses } close={ handleCloseEditAddressSpace } currentAddress={ currentEditingAddress } />
                )
            }
            {
                currentDeletingAddress?._id && (
                    <ConfirmBox message={ `Are you sure you want to delete this address permanently?` } confirm={ handleConfirmDeleteButtonClick } cancel={ handleCloseConfirmBoxButtonClick } close={ handleCloseConfirmBoxButtonClick } />
                )
            }
        </section>
    )
}

export default Address