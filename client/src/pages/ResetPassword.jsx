import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx"

const ResetPassword = () => {
    const [ showNewPassword, setShowNewPassword ] = useState(false)
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [ data, setData ] = useState({
        email : "",
        newPassword : "",
        confirmPassword : ""
    })

    useEffect(() => {
        if (!location?.state?.data?.success) {
            navigate("/")
        }

        if (location?.state?.email) {
            setData(prev => {
                return ({
                    ...prev,
                    email : location.state.email
                })
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const handleResetPasswordButtonColor = Object.values(data).every(ele => ele)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Password and Confirm-password must be same") 
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.reset_password,
                data : data
            })

            if (response?.data?.error) {
                toast.error(`${ response?.status >= 500 ? "Server : " : "" }${ response.data?.message }`)
                return
            }

            if (response?.data?.success) {
                toast.success(response.data?.message)

                setData({
                    email : "",
                    newPassword : "",
                    confirmPassword : ""
                })
                
                navigate("/login")
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="container w-full mx-auto px-2">
            <div className="bg-slate-200 w-full my-6 mx-auto p-6 max-w-lg rounded">
                <p>Please reset you password.</p>
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                    <div className="grid gap-1">
                        <label htmlFor="newPassword">New password</label>
                        <div className="bg-amber-50 rounded flex items-center border border-neutral-300 focus-within:border-blue-800">
                            <input type={ showNewPassword ? "text" : "password" } id="newPassword" name="newPassword" value={data.newPassword} onChange={handleChange} placeholder="Enter your new password" className=" w-full p-2 outline-none"/>
                            <div onClick={ () => {setShowNewPassword(prev => !prev)} } className="cursor-pointer p-2">
                                {
                                    showNewPassword ? (
                                        <IoEye />
                                    ) : (
                                        <IoEyeOff />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <div className="bg-amber-50 rounded flex items-center border border-neutral-300 focus-within:border-blue-800">
                            <input type={ showConfirmPassword ? "text" : "password" } id="confirmPassword" name="confirmPassword" value={data.confirmPassword} onChange={handleChange} placeholder="Enter your new password again" className=" w-full p-2 outline-none"/>
                            <div onClick={ () => {setShowConfirmPassword(prev => !prev)} } className="cursor-pointer p-2">
                                {
                                    showConfirmPassword ? (
                                        <IoEye />
                                    ) : (
                                        <IoEyeOff />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <button disabled={ !handleResetPasswordButtonColor } className={ `${ handleResetPasswordButtonColor ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-gray-500" } text-white py-2 mt-3 rounded font-semibold tracking-wide` }>
                        Reset Password
                    </button>
                </form>
                <p className="mt-4">Don't want to reset password? <Link to={ "/login" } className="font-semibold text-blue-700 hover:text-blue-500">Login</Link></p>
            </div>
        </section>
    )
}

export default ResetPassword