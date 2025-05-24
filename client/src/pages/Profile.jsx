import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import ProfileAvatarUploadSpace from "../components/ProfileAvatarUploadSpace.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import { updateUser } from "../store/userSlice.js";

const Profile = () => {
    const user = useSelector(state => state?.user)
    const dispatch = useDispatch()
    const [ openProfileAvatarUploadSpace, setOpenProfileUploadSpace ] = useState(false)
    const [ updating, setUpdating ] = useState(false)
    const [ userData, setUserData ] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile
    })

    useEffect(() => {
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile
        })
    }, [ user ])

    const handleButtonColor = Object.keys(userData).every(key => userData[key] == user[key])

    const handleProfileAvatarEditClick = () => {
        setOpenProfileUploadSpace(true)
    }

    const handleProfileAvatarUploadSpaceCloseClick = () => {
        setOpenProfileUploadSpace(false)
    }

    const handleUserDetailsChange = (e) => {
        const { name, value } = e.target

        setUserData(prev => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const handleUpdateClick = async (e) => {
        e.preventDefault()

        try {
            setUpdating(true)

            const response = await Axios({
                ...SummaryApi.update_user,
                data : userData
            })

            const { data : responseData } = response
            if (responseData?.success) {
                toast.success(responseData?.message)
                dispatch(updateUser(userData))
            }
        } catch(error) {
            AxiosToastError(error)
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div>
            <div className="w-35 h-35 rounded-full flex items-center justify-center overflow-hidden ring-4">
                {
                    user?.avatar ? (
                        <img src={ user.avatar } alt={ user.name } className="w-full h-full" />
                    ) : (
                        <FaCircleUser className="text-9xl" />
                    )
                }
            </div>
            <button onClick={ handleProfileAvatarEditClick } className="min-w-35 mt-3 text-xs rounded-2xl font-bold tracking-widest bg-slate-200 border border-neutral-300 hover:bg-green-700 hover:text-white cursor-pointer">Edit</button>
            <div>
                {
                    openProfileAvatarUploadSpace && ( 
                        <ProfileAvatarUploadSpace close={ handleProfileAvatarUploadSpaceCloseClick } /> 
                    )
                }
            </div>
            <form onSubmit={ handleUpdateClick } className="my-8 grid gap-6">
                <div className="grid gap-1">
                    <label htmlFor="name">Name</label>
                    <input onChange={ handleUserDetailsChange } type="text" id="name" name="name" value={ userData.name } required placeholder="Enter your name" className="bg-slate-200 outline-none rounded p-2 px-4 text-neutral-600 focus-within:text-black focus-within:font-semibold border border-neutral-300 focus-within:border-blue-600" />
                </div>
                <div className="grid gap-1">
                    <label htmlFor="email">Email</label>
                    <input onChange={ handleUserDetailsChange } type="email" id="email" name="email" value={ userData.email } required placeholder="Enter your email" className="bg-slate-200 outline-none rounded p-2 px-4 text-neutral-600 focus-within:text-black focus-within:font-semibold border border-neutral-300 focus-within:border-blue-600" />
                </div>
                <div className="grid gap-1">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input onChange={ handleUserDetailsChange } type="number" id="mobile" name="mobile" value={ userData.mobile } required placeholder="Enter your mobile number" className="bg-slate-200 outline-none rounded p-2 px-4 text-neutral-600 focus-within:text-black focus-within:font-semibold border border-neutral-300 focus-within:border-blue-600" />
                </div>
                <button disabled={ handleButtonColor } className={ `${ handleButtonColor ? "bg-gray-500" : "bg-green-700 hover:bg-green-600 active:bg-green-500" } mt-8 p-2 rounded text-white font-bold tracking-widest` }>
                    { updating ? "Updating ..." : "Update" }
                </button>
            </form>
        </div>
    )
}

export default Profile