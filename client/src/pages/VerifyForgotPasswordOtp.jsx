import { useRef, useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx"

const VerifyForgotPasswordOtp = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [ data, setData ] = useState([ "", "", "", "", "", "" ])
    const inputRef = useRef([])

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [])

    const handleInputRef = (index) => (ref) => {
        inputRef.current[index] = ref
        return ref
    }

    const handleChange = (index) => (e) => {
        const newData = [ ...data ]
        newData[ index ] = e.target.value
        setData(newData)

        if (e.target.value && index < 5) {
            inputRef.current[index+1].focus()
        }
    }

    const handleButtonColor = data.every(ele => ele)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await Axios({
                ...SummaryApi.verify_forgot_password_otp,
                data : {
                    email : location.state.email,
                    otp : data.join("")
                }
            })

            if (response?.data?.error) {
                toast.error(`${ response?.status >= 500 ? "Server : " : "" }${ response.data?.message }`)
                return
            }

            if (response?.data?.success) {
                toast.success(response.data?.message)

                setData([ "", "", "", "", "", "" ])
                
                navigate("/reset-password", {
                    state : {
                        data : response.data,
                        email : location.state.email
                    }
                })
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="container w-full mx-auto px-2">
            <div className="bg-slate-200 w-full my-6 mx-auto px-6 py-4 max-w-lg rounded">
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                    <div className="grid gap-1">
                        <label htmlFor="otp">Enter your OTP</label>
                        <div className="flex justify-between gap-2 mt-4">
                            {
                                data.map((element, index) => {
                                    return (
                                        <input 
                                            key={ "otp" + index }
                                            type="text" 
                                            id="otp" 
                                            maxLength={ 1 } 
                                            value={ data[index] }
                                            ref={ handleInputRef(index) }
                                            onChange={ handleChange(index) }
                                            className="w-full bg-amber-50 p-2 text-xl rounded outline-none border border-neutral-300 focus:border-blue-800 text-center font-bold"
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <button disabled={ !handleButtonColor } className={ `${ handleButtonColor ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-gray-500" } text-white py-2 mt-3 rounded font-semibold tracking-wide` }>
                        Verify OTP
                    </button>
                </form>
                <p className="mt-4">Do you remember your password? <Link to={ "/login" } className="font-semibold text-blue-700 hover:text-blue-500">Login</Link></p>
            </div>
        </section>
    )
}

export default VerifyForgotPasswordOtp