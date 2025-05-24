import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx"

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [ data, setData ] = useState({
        email : ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const handleButtonColor = Object.values(data).every(ele => ele)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })

            if (response?.data?.error) {
                toast.error(`${ response?.status >= 500 ? "Server : " : "" }${ response.data?.message }`)
                return
            }

            if (response?.data?.success) {
                toast.success(response.data?.message)

                navigate("/verify-forgot-password-otp", {
                    state : data
                })

                setData({
                    email : ""
                })
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="container w-full mx-auto px-2">
            <div className="bg-slate-200 w-full my-6 mx-auto p-6 max-w-lg rounded">
                <p className="font-semibold text-red-700">Forgot password, please enter your registered email.</p>
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                    <div className="grid gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" autoFocus id="email" name="email" value={data.email} onChange={ handleChange } placeholder="Enter your email" className="bg-amber-50 p-2 rounded outline-none border border-neutral-300 focus:border-blue-800"/>
                    </div>
                    <button disabled={ !handleButtonColor } className={ `${ handleButtonColor ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-gray-500" } text-white py-2 mt-3 rounded font-semibold tracking-wide` }>
                        Send OTP
                    </button>
                </form>
                <p className="mt-4">Do you remember your password? <Link to={ "/login" } className="font-semibold text-blue-700 hover:text-blue-500">Login</Link></p>
            </div>
        </section>
    )
}

export default ForgotPassword