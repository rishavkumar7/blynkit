import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx"
import fetchUserDetails from "../utils/fetchUserDetails.js";
import { setUserDetails } from "../store/userSlice.js";

const Login = () => {
    const [ showPassword, setShowPassword ] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [ data, setData ] = useState({
        email : "",
        password : ""
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
                ...SummaryApi.login,
                data : data
            })

            if (response?.data?.error) {
                toast.error(`${ response?.status >= 500 ? "Server : " : "" }${ response.data?.message }`)
                return
            }

            if (response?.data?.success) {
                toast.success(response.data?.message)

                localStorage.setItem("access-token", response.data.data.accessToken)
                localStorage.setItem("refresh-token", response.data.data.refreshToken)
                
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
                
                setData({
                    email : "",
                    password : ""
                })
                
                navigate("/")
                window.dispatchEvent(new Event("custom-reload-event"))
                localStorage.setItem("reload-app-trigger", true)
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="container w-full mx-auto px-2">
            <div className="bg-slate-200 w-full my-6 mx-auto p-6 max-w-lg rounded">
                <form onSubmit={handleSubmit} className="mt-4 grid gap-5">
                    <div className="grid gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" autoFocus id="email" name="email" value={data.email} onChange={handleChange} placeholder="Enter your email" className="bg-amber-50 p-2 rounded outline-none border border-neutral-300 focus:border-blue-800"/>
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="password">Password</label>
                        <div className="bg-amber-50 rounded flex items-center border border-neutral-300 focus-within:border-blue-800">
                            <input type={ showPassword ? "text" : "password" } id="password" name="password" value={data.password} onChange={handleChange} placeholder="Enter your password" className=" w-full p-2 outline-none"/>
                            <div onClick={ () => {setShowPassword(prev => !prev)} } className="cursor-pointer p-2">
                                {
                                    showPassword ? (
                                        <IoEye />
                                    ) : (
                                        <IoEyeOff />
                                    )
                                }
                            </div>
                        </div>
                        <Link to={ "/forgot-password" } className="font-semibold text-xs ml-auto text-blue-700 hover:text-blue-500">Forgot Password?</Link>
                    </div>
                    <button disabled={ !handleButtonColor } className={ `${ handleButtonColor ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-gray-500" } text-white py-2 mt-3 rounded font-semibold tracking-wide` }>
                        Login
                    </button>
                </form>
                <p className="mt-4">Don't have an account? <Link to={ "/register" } className="font-semibold text-blue-700 hover:text-blue-500">Register</Link></p>
            </div>
        </section>
    )
}

export default Login