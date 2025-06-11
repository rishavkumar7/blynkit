import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { HiUpload } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import toast from "react-hot-toast"
import uploadImage from "../utils/uploadImage.js"
import ImageView from "../components/ImageView.jsx"
import CategoryChip from "../components/CategoryChip.jsx"
import SubcategoryChip from "../components/SubcategoryChip.jsx"
import AddNewFieldSpace from "../components/AddNewFieldSpace.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import Axios from "../utils/Axios.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import { successAlert } from "../utils/successAlert.jsx"

const ProductUpload = () => {
    const scrollRef = useRef(null)
    const categories = useSelector(state => state?.product?.categories)
    const subcategories = useSelector(state => state?.product?.subcategories)
    const [ uploading, setUploading ] = useState(false)
    const [ adding, setAdding ] = useState(false)
    const [ openImage, setOpenImage ] = useState("")
    const [ openAddFieldSpace, setOpenAddFieldSoace ] = useState(false)
    const [ data, setData ] = useState({
        name : "",
        image : [],
        category : [],
        sub_category : [],
        unit : "",
        stock : "",
        price : "",
        discount : "",
        description : "",
        more_details : {},
        publish : true
    })

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [ data?.image ])

    const filterSubcategoriesFromCategories = (subcategories) => {
        return [ ...subcategories ].filter(subcat => {
            let check = false

            subcat?.category.forEach(cat => {
                if (data?.category.find(category => category?._id === cat?._id)) {
                    check=true
                }
            })

            return check
        })
    }

    const isAllowedToRemoveCategory = (cat) => {
        let dependency = false
        data?.sub_category.forEach(subcat => {
            if (subcat?.category.find(category => category?._id === cat?._id)) {
                dependency = true
                subcat?.category.forEach(category => {
                    if (category?._id !== cat?._id && data?.category.find(otherCategory => otherCategory?._id === category?._id)) {
                        dependency = false
                    }
                })
            }
        })
        return !dependency
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setData(prev => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const handleMoreDetailsChange = (e) => {
        const { name, value } = e.target

        setData(prev => {
            return {
                ...prev,
                more_details : {
                    ...(prev?.more_details),
                    [ name ] : value
                }
            }
        })
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        setUploading(true)

        const response = await uploadImage(file, `product/${ data?.name }`)
        const { data : responseData } = response

        setData(prev => {
            return {
                ...prev,
                image : [ ...prev?.image, responseData?.data?.url ]
            }
        })

        e.target.value = ""
        setUploading(false)
    }

    const handleImageClick = (index) => {
        setOpenImage(data?.image[index])
    }

    const handleCloseImageClick = () => {
        setOpenImage("")
    }

    const handleRemoveImageClick = (index) => {
        const newImages = [ ...data?.image ]
        newImages.splice(index, 1)
        setData(prev => {
            return {
                ...prev,
                image : newImages
            }
        })
    }

    const handleSelectCategoryChange = (e) => {
        const value = e.target.value
        const newCategory = categories.find(category => category?._id === value)
        
        setData(prev => {
            return {
                ...prev,
                category : [ ...prev?.category, newCategory ]
            }
        })
    }

    const handleRemoveCategoryChip = (cat) => {
        if (!isAllowedToRemoveCategory(cat)) {
            toast.error("Cannot remove this category as this category is in use.")
            return
        }

        const newCategoryList = [ ...data?.category ]
        const removeIndex = newCategoryList.findIndex(category => category?._id === cat?._id)

        newCategoryList.splice(removeIndex, 1)

        setData(prev => {
            return {
                ...prev,
                category : newCategoryList
            }
        })
    }

    const handleSelectSubcategoryChange = (e) => {
        const value = e.target.value
        const newSubcategory = subcategories.find(sub_category => sub_category?._id === value)
        
        setData(prev => {
            return {
                ...prev,
                sub_category : [ ...prev?.sub_category, newSubcategory ]
            }
        })
    }

    const handleRemoveSubcategoryChip = (subcat) => {
        const newSubcategoryList = [ ...data?.sub_category ]
        const removeIndex = newSubcategoryList.findIndex(sub_category => sub_category?._id === subcat?._id)

        newSubcategoryList.splice(removeIndex, 1)

        setData(prev => {
            return {
                ...prev,
                sub_category : newSubcategoryList
            }
        })
    }

    const handleAddNewFieldClick = () => {
        if (!data?.name.trim()) {
            return
        }

        setOpenAddFieldSoace(true)
    }

    const handleSubmitAddFieldSpace = (newFieldData) => {
        let newField = newFieldData?.name.trim().replace(/\s+/g, ' ')
        newField = newField.charAt(0).toUpperCase() + newField.slice(1)

        setData(prev => {
            return {
                ...prev,
                more_details : {
                    ...prev?.more_details,
                    [ newField ] : ""
                }
            }
        })

        setOpenAddFieldSoace(false)
    }

    const handleCloseAddFieldSpace = () => {
        setOpenAddFieldSoace(false)
    }

    const handleDeleteAdditionalFieldButtonClick = (index) => {
        const keys = Object.keys(data?.more_details)
        keys.splice(index, 1)

        const newMoreDetails = Object.fromEntries(keys.map(key => [ key, data?.more_details[key] ]))

        setData(prev => {
            return {
                ...prev,
                more_details : newMoreDetails
            }
        })
    }

    const isAllowedToSubmit = () => {
        let check = true

        Object.keys(data).forEach(key => {
            if (key === "stock" || key === "discount" || key === "more_details" || key ==="publish") {
                return
            } else if (key === "image" || key === "category" || key === "sub_category") {
                check = check && data[key][0]
            } else {
                check = check && data[key]
            }
        })

        return check
    }

    const handleUploadProductButtonClick = async (e) => {
        e.preventDefault()

        try {
            setAdding(true)

            const response = await Axios({
                ...SummaryApi.add_product,
                data : {
                    ...data,
                    category : Object.values(data?.category).map(cat => cat?._id),
                    sub_category : Object.values(data?.sub_category).map(subcat => subcat?._id)
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                successAlert(responseData?.message)
                setData({
                    name : "",
                    image : [],
                    category : [],
                    sub_category : [],
                    unit : "",
                    stock : "",
                    price : "",
                    discount : "",
                    description : "",
                    more_details : {},
                    publish : true
                })
            }

            setAdding(false)
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="w-full h-full">
            <div className="relative h-14 px-4 flex items-center justify-between shadow-sm">
                <h2 className="text-xl text-neutral-600 font-bold tracking-wide">Upload a Product</h2>
            </div>
            <div className="mx-3 sm:mx-15">
                <form onSubmit={ handleUploadProductButtonClick } className="my-5 grid gap-6 sm:gap-8">
                    <div className="grid gap-1">
                        <label htmlFor="name" className="font-semibold text-neutral-800 tracking-wide" >Name</label>
                        <input onChange={ handleChange } autoFocus type="text" name="name" value={ data?.name } placeholder="Enter product name" id="name" required className="bg-slate-200 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="description" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Description</label>
                        <textarea onChange={ handleChange } disabled={ !data?.name.trim() } type="text" name="description" value={ data?.description } placeholder="Enter product description" id="description" required rows={ 3 } className="bg-slate-200 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded resize-none" />
                    </div>
                    <div className="grid gap-1">
                        <p className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Image</p>
                        <div className="grid sm:grid-cols-3 gap-2 sm:gap-4">
                            <div className="border border-transparent">
                                <div className={ `bg-slate-200 w-full h-30 ${ data?.name.trim() ? "text-neutral-600 font-bold" : "text-neutral-500" } text-sm rounded border border-neutral-300 sm:col-span-1` }>
                                    <label htmlFor="uploadImage" className="w-full h-full" >
                                        {
                                            uploading ? (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-400 text-white text-lg font-semibold">
                                                    <p>Uploading ...</p>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" >
                                                    <HiUpload size={ 40 } className={ `${ data?.name.trim() ? "text-green-700" : "text-neutral-400" }` } />
                                                    <p>Upload Image</p>
                                                </div>
                                            )
                                        }
                                    </label>
                                    <input disabled={ !data?.name.trim() || uploading } onChange={ handleUploadImage } type="file" id="uploadImage" accept="image/*" className="hidden" />
                                </div>
                            </div>
                            <div ref={ scrollRef } className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden sm:col-span-2">
                                {
                                    data?.image.map((img, index) => {
                                        return (
                                            <div onClick={ () => { handleImageClick(index) } } key={ index } className="relative group border cursor-pointer" >
                                                <img src={ img } alt="product image" className="min-w-30 h-30 object-cover" />
                                                <div className="p-1 absolute top-0 bottom-0 left-0 right-0 hidden group-hover:flex items-start justify-end group-hover:bg-[linear-gradient(235deg,_rgba(0,0,0,0.7)_1%,_transparent_65%)]" >
                                                    <RiDeleteBin6Line onClick={ (e) => { e.stopPropagation(); handleRemoveImageClick(index) } } size={ 20 } className="z-1 text-white" />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <div className="flex gap-3 overflow-hidden">
                            <label className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Category</label>
                            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                                {
                                    data?.category.map(category => {
                                        return <div key={ category?._id } className="w-full h-full"><CategoryChip category={ category } removeCategory={ handleRemoveCategoryChip } className="bg-slate-200" /></div>
                                    })
                                }
                            </div>
                        </div>
                        <select value={ "selectCategory" } disabled={ !data.name } onChange={ handleSelectCategoryChange } className={ `bg-slate-200 p-2 ${ !data?.name.trim() ? "text-neutral-500" : "" } border border-neutral-300 focus-within:border-blue-600 outline-none rounded` } >
                            <option value={ "selectCategory" } disabled>Select Category</option>
                            {
                                [ ...categories ].map(category => <option value={ category?._id } key={ category?._id } >{ category?.name }</option>)
                            }
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <div className="flex gap-3 overflow-hidden">
                            <label className={ `font-semibold ${ !(data?.name.trim() && data?.category[0]) ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Subcategory</label>
                            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                                {
                                    data?.sub_category.map(sub_category => {
                                        return <div key={ sub_category?._id } className="w-full h-full"><SubcategoryChip subcategory={ sub_category } removeSubcategory={ handleRemoveSubcategoryChip } className="bg-slate-200" /></div>
                                    })
                                }
                            </div>
                        </div>
                        <select value={ "selectSubcategory" } disabled={ !(data?.name.trim() && data?.category[0]) } onChange={ handleSelectSubcategoryChange } className={ `bg-slate-200 p-2 ${ !(data?.name.trim() && data?.category[0]) ? "text-neutral-500" : "" } border border-neutral-300 focus-within:border-blue-600 outline-none rounded` } >
                            <option value={ "selectSubcategory" } disabled>Select Subcategory</option>
                            {
                                filterSubcategoriesFromCategories(subcategories).map(sub_category => <option value={ sub_category?._id } key={ sub_category?._id } >{ sub_category?.name }</option>)
                            }
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="unit" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Unit</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="text" name="unit" value={ data?.unit } placeholder="Enter product unit" id="unit" required className="bg-slate-200 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="stock" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Number of Stock</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="number" name="stock" value={ data?.stock } placeholder="Enter product stock" id="stock" className="bg-slate-200 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="price" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Price</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="number" name="price" value={ data?.price } placeholder="Enter product price" id="price" required className="bg-slate-200 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="discount" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Discount</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="number" name="discount" value={ data?.discount } placeholder="Enter product discount" id="discount" className="bg-slate-200 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    {
                        Object.keys(data?.more_details).map((newField, index) => {
                            return (
                                <div key={ index } className="grid gap-1">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor={ newField } className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >{ newField }</label>
                                        <RiDeleteBin6Line onClick={ () => { handleDeleteAdditionalFieldButtonClick(index) } } size={ 20 } className="text-neutral-400 hover:text-neutral-800 cursor-pointer" />
                                    </div>
                                    <input onChange={ handleMoreDetailsChange } disabled={ !data?.name.trim() } type="text" name={ newField } value={ data?.more_details[newField] } placeholder={ `Enter product ${ newField }` } id={ newField } className="bg-slate-200 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                                </div>
                            )
                        })
                    }
                    <div className="flex items-center justify-start">
                        <div onClick={ handleAddNewFieldClick } className={ `px-3 py-1 ${ !data?.name.trim() ? "bg-neutral-500" : "bg-blue-800 hover:bg-blue-700 active:bg-blue-600" } text-white font-semibold rounded cursor-pointer` }>Add New Field</div>
                    </div>
                    <button disabled={ !isAllowedToSubmit() } className={ `${ isAllowedToSubmit() ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-neutral-500" } p-2 rounded text-white font-bold tracking-widest text-lg cursor-pointer` } >
                        {
                            adding ? (
                                "Adding ..."
                            ) : (
                                "Add Product"
                            )
                        }
                    </button>
                </form>
            </div>
            {
                openImage && (
                    <div>
                        <ImageView imageUrl={ openImage } close={ handleCloseImageClick } />
                    </div>
                )
            }
            {
                openAddFieldSpace && (
                    <div>
                        <AddNewFieldSpace submit={ handleSubmitAddFieldSpace } close={ handleCloseAddFieldSpace } />
                    </div>
                )
            }
        </section>
    )
}

export default ProductUpload