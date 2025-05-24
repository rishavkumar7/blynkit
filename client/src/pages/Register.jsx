import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx"

const Register = () => {
    const [ showPassword, setShowPassword ] = useState(false)
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false)
    const navigate = useNavigate()
    const [ data, setData ] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
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

    const handleRegisterButtonColor = Object.values(data).every(ele => ele)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (data.password !== data.confirmPassword) {
            toast.error("Password and Confirm-password must be same") 
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })

            if (response?.data?.error) {
                toast.error(`${ response?.status >= 500 ? "Server : " : "" }${ response.data?.message }`)
                return
            }

            if (response?.data?.success) {
                toast.success(response.data?.message)

                setData({
                    name : "",
                    email : "",
                    password : "",
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
                <p>Welcome to Blynkit !!</p>
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                    <div className="grid gap-1">
                        <label htmlFor="name">Name</label>
                        <input type="text" autoFocus id="name" name="name" value={data.name} onChange={handleChange} placeholder="Enter your name" className="bg-amber-50 p-2 rounded outline-none border border-neutral-300 focus:border-blue-800"/>
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={data.email} onChange={handleChange} placeholder="Enter your email" className="bg-amber-50 p-2 rounded outline-none border border-neutral-300 focus:border-blue-800"/>
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
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <div className="bg-amber-50 rounded flex items-center border border-neutral-300 focus-within:border-blue-800">
                            <input type={ showConfirmPassword ? "text" : "password" } id="confirmPassword" name="confirmPassword" value={data.confirmPassword} onChange={handleChange} placeholder="Enter your password again" className=" w-full p-2 outline-none"/>
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
                    <button disabled={ !handleRegisterButtonColor } className={ `${ handleRegisterButtonColor ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-gray-500" } text-white py-2 mt-3 rounded font-semibold tracking-wide` }>
                        Register
                    </button>
                </form>
                <p className="mt-4">Already have an account? <Link to={ "/login" } className="font-semibold text-blue-700 hover:text-blue-500">Login</Link></p>
            </div>
        </section>
    )
}

export default Register