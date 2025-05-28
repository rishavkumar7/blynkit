import { useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import uploadImage from "../utils/uploadImage.js";
import AxiosToastError from "../utils/AxiosToastError.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import Axios from "../utils/Axios.jsx";

const AddCategorySpace = ({ fetchCategories, close }) => {
    const [ uploading, setUploading ] = useState(false)
    const [ adding, setAdding ] = useState(false)
    const [ data, setData ] = useState({
        name : "",
        image : ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setData(prev => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        setUploading(true)

        const response = await uploadImage(file)
        const { data : responseData } = response

        setData(prev => {
            return {
                ...prev,
                image : responseData?.data?.url
            }
        })

        setUploading(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setAdding(true)
            const response = await Axios({
                ...SummaryApi.add_category,
                data : data
            })

            const { data : responseData } = response
            if (responseData?.success) {
                toast.success(responseData?.message)
                fetchCategories()
                close()
            }
        } catch(error) {
            AxiosToastError(error)
        } finally {
            setAdding(false)
        }
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-200">
            <div className="bg-slate-200 max-w-3xl w-full rounded-xl m-4 px-10 py-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-neutral-800">Add New Category</h2>
                    <button onClick={ close } className="w-fit block ml-auto cursor-pointer" >
                        <IoClose size={ 25 } className="text-neutral-700" />
                    </button>
                </div>
                <form onSubmit={ handleSubmit } className="my-5 grid gap-4">
                    <div className="grid gap-1">
                        <label htmlFor="name">Name</label>
                        <input onChange={ handleChange } type="text" name="name" value={ data.name } placeholder="Enter category name" id="name" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <p>Image</p>
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <div className="bg-amber-50 text-neutral-400 text-sm w-full lg:w-80 h-50 rounded flex items-center justify-center border border-neutral-300">
                                {
                                    data?.image ? (
                                        <img alt="category image" src={ data.image } className="max-w-full max-h-full border border-neutral-300" />
                                    ) : (
                                        <p>No image</p>
                                    )
                                }
                            </div>
                            <label htmlFor="uploadImage" >
                                <div className={ `${ data?.name ? "bg-blue-800 hover:bg-blue-700 active:bg-blue-600" : "bg-gray-500" } text-white select-none font-semibold px-4 py-2 rounded tracking-wider ${ data?.name ? "cursor-pointer" : "cursor-default" }` }>
                                    {
                                        uploading ? (
                                            "Uploading ..."
                                        ) : (
                                            "Upload Image"
                                        )
                                    }
                                </div>
                            </label>
                            <input onChange={ handleUploadImage } disabled={ !data.name } type="file" id="uploadImage" className="hidden" />
                        </div>
                    </div>
                    <button disabled={ !(data?.name && data?.image) } className={ `${ (data?.name && data?.image) ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-gray-500" } text-white mt-4 p-2 font-semibold tracking-wider rounded ${ (data?.name && data?.image ) ? "cursor-pointer" : "cursor-default" }` } >
                        {
                            adding ? (
                                "Adding ..."
                            ) : (
                                "Add Category"
                            )
                        }
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddCategorySpace